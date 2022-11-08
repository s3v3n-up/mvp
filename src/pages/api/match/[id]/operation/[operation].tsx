import {
    updateMatchQueueStartTime,
    getMatchById,
    removeMemberFromTeam,
    updateMatchFields
} from "@/lib/actions/match";
import { removeMatchFromUserMatches } from "@/lib/actions/user";
import { NextApiRequest, NextApiResponse } from "next";
import Database from "@/lib/resources/database";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
        const operations = ["pause", "start", "queue", "cancel", "remove", "finish"];

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

        //guard against unauthorized access
        if ((operation === "pause" ||
            operation === "finish" ||
            operation === "cancel") &&
            session.user.id !== match.matchHost) {
            throw {
                code: 401,
                message: "Unauthorized",
            };
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
            const { teamIndex, userName } = req.body;
            if ( typeof userName !== "string" ||
                isNaN(parseInt(teamIndex)) ||
                parseInt(teamIndex) < 0 ||
                parseInt(teamIndex) > 1
            ) {
                throw {
                    code: 400,
                    message: "Invalid request",
                };
            }

            //remove member from match and update queue start time to null
            await removeMemberFromTeam(id, teamIndex, userName);
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

        if (operation === "cancel") {
            await updateMatchFields(id, {
                status: "CANCELLED",
            });
        }

        if (operation === "finish") {
            const homeScore = match.teams[0].score;
            const awayScore = match.teams[1].score;
            updateMatchFields(id, {
                status: "FINISHED",
                matchEnd: new Date(),
                teams: [
                    {
                        ...match.teams[0],
                        status: homeScore > awayScore ? "WIN" : homeScore < awayScore ? "LOSE" : "DRAW",
                    },
                    {
                        ...match.teams[1],
                        status: homeScore > awayScore ? "LOSE" : homeScore < awayScore ? "WIN" : "DRAW",
                    }
                ]
            });
        }

        res.status(200).json({ message: "operation success" });
    } catch(error: any) {
        res.status(error.code || 500).json({ message: error.message, cause: error.cause });
    }
}