//import from nextjs
import Image from "next/image";

/**
 * player props
 * @prop {string} image - palyer image
 * @prop {string} name - player name
 * @props onLeave - callback function when player leaves
 * @prop {string} variant - player variant (home/away)
 */
 interface PlayerProps {
    image: string;
    name: string;
    onLeave: () => void;
    variant: "home" | "away";
}

/**
 * scoreboard player component
 * @param props - player props
 * @returns {JSX.Element} - player component for scoreboard page
 */
export default function Player(props: PlayerProps) {

    /**
     * component styles for different player variant
     */
    const variantStyle = {
        home: {
            container: "text-orange-500",
            button: "rounded-md border-2 border-orange-500 px-7 py-0.5 md:text-base text-sm"
        },
        away: {
            container: "text-white",
            button: "rounded-md border-2 border-white px-7 py-0.5 md:text-base text-sm"
        }
    };

    return (
        <div
            className={`flex flex-row justify-between items-center w-full sm:text-base text-sm ${variantStyle[props.variant].container}`}
        >
            <div className="relative rounded-full w-12 h-12">
                <Image
                    src={props.image}
                    alt="player avatar"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    className="rounded-full"
                />
            </div>
            <div>{props.name}</div>
            <button onClick={props.onLeave} className={variantStyle[props.variant].button}>Leave</button>
        </div>
    );
};