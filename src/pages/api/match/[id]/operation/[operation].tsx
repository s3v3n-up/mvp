import {
    updateMatchQueueStartTime,
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
import { APIErr } from "@/lib/types/General";
import { string } from "yup";

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

        //all available operations
        const operations = ["pause", "start", "queue", "cancel", "remove", "finish", "resume"];

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
            if (session.user.id !== match.matchHost) {
                if (isFullMember && match.matchType === "REGULAR") {
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
            await updateMatchQueueStartTime(id as string, !isNaN(Date.parse(queueStartTime)) ? new Date(queueStartTime) : null);
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
            await updateMatchQueueStartTime(id, null);
            await removeMatchFromUserMatches(userName, id);

            //commit and end transaction
            await transaction.commitTransaction();
            transaction.endSession();
        }

        //this operation happens when the queuing end
        if (operation === "start") {
            const { startTime } = req.body;

            //validate matchStartTime
            if (isNaN(Date.parse(startTime))) {
                throw {
                    code: 400,
                    message: "bad request"
                };
            }

            //update matchStartTime
            await updateMatchFields(id, {
                matchStart: startTime,
                matchQueueStart: null,
                status: "INPROGRESS",
            });
        }

        //this operation happens when the host pauses the match
        if (operation === "pause") {
            const { pauseTime } = req.body;

            //validate pauseTime
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

            //update matchResume
            await updateMatchFields(id, {
                matchResume: resumeTime,
                status: "RESUMED",
            });
        }

        //operation happens when the host cancel the match
        if (operation === "cancel") {
            const { cancelTime } = req.body;

            //validate cancelTime
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
            const homeScore = match.teams[0].score;
            const awayScore = match.teams[1].score;

            //update match status and team scores, status
            const updatedMatch = await updateMatchFields(id, {
                status: "FINISHED",
                matchEnd: new Date()
            });

            //update the team status
            updatedMatch!.teams[0].status = homeScore > awayScore ? "WIN" : homeScore < awayScore ? "LOSE" : "DRAW";
            updatedMatch!.teams[1].status = awayScore > homeScore ? "WIN" : awayScore < homeScore ? "LOSE" : "DRAW";
            updatedMatch!.save();
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