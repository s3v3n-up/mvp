//import from nextjs
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

/**
 * player props
 * @prop {string} image - palyer image
 * @prop {string} userName - player name
 * @props onLeave - callback function when player leaves
 * @prop {string} variant - player variant (home/away)
 */
 interface PlayerProps {
    image: string;
    userName: string;
    isLeavable: boolean;
    variant: "home" | "away";
    matchId: string;
    hostId: string;
}

/**
 * scoreboard player component
 * @param props - player props
 * @returns {JSX.Element} - player component for scoreboard page
 */
export default function Player(props: PlayerProps) {

    //check to see should leave button be shown
    const { data: session } = useSession();
    const [showLeave, setShowLeave] = useState<boolean>(false);

    useEffect(()=> {
        if (session && session.user) {
            if (session.user.userName === props.userName) {
                setShowLeave(true);
            }
            if (session.user.id === props.hostId) {
                setShowLeave(false);
            }
        }
    }, [session, props]);

    /**
     * component styles for different player variant
     */
    const variantStyle = {
        home: {
            container: "text-orange-500",
            button: "rounded-md border-2 border-orange-500 py-0.5 lg:text-base text-sm text-center lg:w-4/5 w-full ml-auto"
        },
        away: {
            container: "text-white",
            button: "rounded-md border-2 border-white py-0.5 lg:text-base text-sm text-center lg:w-4/5 w-full ml-auto"
        }
    };

    const router = useRouter();

    //function for the user to leave the match
    async function onLeave() {
        const userName= props.userName;
        await axios.put(`/api/match/${props.matchId}/operation/remove`, {
            userName
        })
            .then(()=>router.push("/"))
            .catch((err)=>console.log(err));

    }

    return (
        <div
            className={`grid grid-cols-3 gap-3 w-full h-full sm:text-base text-sm 
                        ${variantStyle[props.variant].container}`}
        >
            <div className="relative rounded-full lg:w-12 lg:h-12 w-10 h-10">
                <Image
                    src={props.image}
                    alt="player avatar"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-full"
                />
            </div>
            <p className="lg:text-base text-sm flex flex-row items-center">{props.userName}</p>
            {props.isLeavable && showLeave && (
                <button onClick={onLeave} className={variantStyle[props.variant].button}>Leave</button>
            )}
        </div>
    );
};