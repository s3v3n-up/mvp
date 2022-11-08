//third party imports
import dynamic from "next/dynamic";
import { GetServerSidePropsContext } from "next/types";
import { getMatchById } from "@/lib/actions/match";
import Database from "@/lib/resources/database";
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

//local-import
const Draw = dynamic(() => import("@/components/results/draw"));
const Lose = dynamic(() => import ("@/components/results/lose"));
const Win = dynamic(() => import("@/components/results/win"));

/**
 * @description this page displays multiple components depends on the match result
 */
export default function Result({ result } : {result : string}) {
    return(
        <>
            {result === "WIN" ? <Win /> : result === "LOSE" ? <Lose /> : <Draw />}
        </>
    );
}

//server side props for the results of the match
export async function getServerSideProps(context: GetServerSidePropsContext){
    const { id } = context.params as {id: string};
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    //checks if there is a session
    if(!session){
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    //get database connection
    await Database.setup();

    //get the match data
    const match = await getMatchById(id);

    //checks if the match is finished or not
    if(match.status !== "FINISHED"){
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }
    const players = match.teams[0].members.concat(match.teams[1].members);

    //checks if the user is in the match
    if(!players.includes(session.user.userName)){
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    const matchResult = { result: "" };

    //checks the status for each team and gets the result of either team
    match.teams.forEach(team => {
        if(team.status === "WIN" && team.members.includes(session.user.userName)){
            matchResult.result = "WIN";
        } else if(team.status === "DRAW" && team.members.includes(session.user.userName)){
            matchResult.result = "DRAW";
        } else if(team.status === "LOSE" && team.members.includes(session.user.userName)){
            matchResult.result = "LOSE";
        }
    });

    return {
        props: {
            result: matchResult.result
        }
    };
}


