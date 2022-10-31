import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";

/**
 * create token request for ably
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new Ably.Realtime(env.ABLY_API_KEY!);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: "mvp_clientId" });
    res.status(200).json(tokenRequestData);
}