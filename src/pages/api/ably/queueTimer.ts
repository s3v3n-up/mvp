import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";


//game queue timer for when a player is waiting for a game to start
export default async function gameQueue(req: NextApiRequest, res: NextApiResponse) {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY!);
    const channel = client.channels.get("gameTimer");
    channel.publish("gameTimer", 30);
    res.status(200).json({ message: 30 });



}