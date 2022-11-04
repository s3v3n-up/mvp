//third party imports
import dynamic from "next/dynamic";

//local-import
const Draw = dynamic(() => import("@/components/results/draw"));
const Lose = dynamic(() => import ("@/components/results/lose"));
const Win = dynamic(() => import("@/components/results/win"));

/**
 * @description this page displays multiple components depends on the match result
 */
export default function Result(){
    return(
        <>
            <Win/>
            <Draw/>
            <Lose/>
        </>
    );
}