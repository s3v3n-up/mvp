import {
    getMatchById,
    removeUserFromMatch,
    updateMatchFields
} from "@/lib/actions/match";
import { removeMatchFromUserMatches } from "@/lib/actions/user";
import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUTCTime } from "@/lib/helpers/time";
import { APIErr } from "@/lib/types/General";
import { operations } from "@/constants/operations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        //guard against non-PUT requests
        if (req.method !== "PUT") {
            throw {
                code: 405,
                message: "Method not allowed",
            };
        }

        //guard against unauthorized access
        const session = await unstable_getServerSession(req, res, authOptions);
        if (!session) {
            throw {
                code: 401,
                message: "Unauthorized",
            };
        }

        //destructure request params to get id and operation name
        const { id, operation } = req.query;

        //guard against query
        if (typeof id !== "string" || typeof operation !== "string" || !operations.includes(operation)) {
            throw {
                code: 400,
                message: "Invalid request",
            };
        }

        //get match from database
        await Database.setup();
        const match = await getMatchById(id);

        //guard against unauthorized access for pause and finish operation
        //only host can pause or end the match
        if ((operation === "pause" ||
            operation === "finish") &&
            session.user.id !== match.matchHost) {
            throw {
                code: 401,
                message: "Unauthorized",
            };
        }

        //guard against unauthorized access for cancel operation
        if (operation === "cancel") {
            const amountOfPlayers = match.teams[0].members.concat(match.teams[1].members).length;
            const isFullMember = amountOfPlayers === match.gameMode.requiredPlayers;

            //if user is not the match host
            if (session.user.id !== match.matchHost) {

                //user cannot cancel a regular match if it is full
                if (isFullMember && match.matchType === "REGULAR" ||

                    //only host can cancel quick match
                    match.matchType === "QUICK") {
                    throw {
                        code: 401,
                        message: "Unauthorized",
                    };
                }
            }
        }

        //this operation happen when match has enough players to start or when a player leaves the match
        if (operation === "queue") {

            // Deconstruct values to be from the client side
            const { queueStartTime } = req.body;

            //validate matchQueueStartTime
            if (isNaN(Date.parse(queueStartTime)) && queueStartTime !== null) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //update matchQueueStartTime
            await updateMatchFields(id, {
                matchQueueStart: queueStartTime
            });
        }

        //this operation happe when user clicks on leave button
        if (operation === "remove") {

            //start transaction
            const session = await Database.setup();
            const transaction = await session.startSession();
            transaction.startTransaction();

            //remove player from match
            const { userName } = req.body;
            if ( typeof userName !== "string") {
                throw {
                    code: 400,
                    message: "Invalid request",
                };
            }

            //remove member from match and update queue start time to null
            await removeUserFromMatch(id as string, userName);
            await updateMatchFields(id, {
                matchQueueStart: null
            });

            //remove match from user matches history
            await removeMatchFromUserMatches(userName, id);

            //commit and end transaction
            await transaction.commitTransaction();
            transaction.endSession();
        }

        //this operation happens when the queuing end
        if (operation === "start") {
            const { startTime } = req.body;

            //guard against invalid startTime
            if (isNaN(Date.parse(startTime)) && startTime !== null) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            if (startTime === null) {
                await updateMatchFields(id, {
                    matchStart: null,
                    matchQueueStart: null
                });
            } else {

                //update matchStartTime
                await updateMatchFields(id, {
                    matchStart: startTime,
                    matchQueueStart: null,
                    status: "INPROGRESS",
                });
            }
        }

        //this operation happens when the host pauses the match
        if (operation === "pause") {
            const { pauseTime } = req.body;

            //guard against invalid pauseTime
            if (isNaN(Date.parse(pauseTime))) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //update matchPause
            await updateMatchFields(id, {
                matchPause: pauseTime,
                status: "PAUSED",
            });
        }

        if (operation === "resume") {
            const { resumeTime } = req.body;

            //validate resumeTime
            if (isNaN(Date.parse(resumeTime))) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //calculate accumulated match pause delta
            const matchPauseTimeUTC = match.matchPause ? getUTCTime(match.matchPause) : 0;
            const matchResumeTimeUTC = getUTCTime(resumeTime);
            const matchPauseDuration = Math.floor((matchResumeTimeUTC - matchPauseTimeUTC) / 1000);
            const matchPauseDelta = (match.matchPauseDelta??0) + matchPauseDuration;

            //update match
            await updateMatchFields(id, {
                matchPauseDelta,
                matchPause: null,
                status: "INPROGRESS"
            });
        }

        //operation happens when the host cancel the match
        if (operation === "cancel") {
            const { cancelTime } = req.body;

            //guard against invalid cancelTime
            if (isNaN(Date.parse(cancelTime))) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //cancel match
            await updateMatchFields(id, {
                status: "CANCELLED",
                matchEnd: cancelTime,
            });
        }

        //operation happens when the match ends
        if (operation === "finish") {

            //teams scores
            const homeScore = match.teams[0].score;
            const awayScore = match.teams[1].score;

            //update match status and team scores, status
            const updatedMatch = await updateMatchFields(id, {
                status: "FINISHED",
                matchEnd: new Date()
            });

            //guard against non-existing match
            if (!updatedMatch) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //update the team status based on the match scores
            if (homeScore === awayScore) {
                updatedMatch.teams[0].status = "DRAW";
                updatedMatch.teams[1].status = "DRAW";
            } else if (homeScore > awayScore) {
                updatedMatch.teams[0].status = "WIN";
                updatedMatch.teams[1].status = "LOSE";
            } else {
                updatedMatch.teams[0].status = "LOSE";
                updatedMatch.teams[1].status = "WIN";
            }

            //save updated match
            updatedMatch.save();
        }
        res.status(200).json(
            {
                code: 200,
                message: "operation success",
                cause:""
            }
        );
    } catch(error) {
        const {
            code = 500,
            message="internal server error",
            cause="internal error"
        } = error as APIErr;
        res.status(code).json(
            {
                code,
                message,
                cause
            }
        );
    }
}