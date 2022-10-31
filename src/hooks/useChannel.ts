import Ably from "ably/promises";
import { useEffect } from "react";

/**
 * ably instance
 */
const ably = new Ably.Realtime.Promise({ authUrl: "/api/ably/createTokenRequest" });

/**
 * hook to subscribe to an ably channel
 * @param channelName name of channel to subscribe to
 * @param callbackOnMessage callback function to run when a message is received
 * @returns [channel, ably] channel and ably instance
 */
export default function useChannel(channelName: string, callbackOnMessage: (message: any) => void) {
    const channel = ably.channels.get(channelName);
    useEffect(()=> {
        channel.subscribe(msg => {
            callbackOnMessage(msg);
        });

        return () => {
            channel.unsubscribe();
        };
    });

    return [channel, ably];
}