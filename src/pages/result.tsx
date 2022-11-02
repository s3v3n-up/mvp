//local-import
import Draw from "@/components/results/draw";
import Lose from "@/components/results/lose";
import Win from "@/components/results/win";

/**
 *
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