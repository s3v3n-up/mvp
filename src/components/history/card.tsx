import type { Match } from "@/lib/types/Match";
import { dateConverter } from "@/lib/helpers/time";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import SnackBar from "../snackbar";
import { useState } from "react";
import { useRouter } from "next/router";

/**
 * history card component
 * @param {Match} props  - The match object to be displayed
 * @returns {JSX.Element} - The card component of history page
 */
export default function Card(props: Match) {

    //get user session
    const { session } = useAuth();
    const router = useRouter();

    //network error state
    const [networkError, setNetworkError] = useState("");

    // Function cancel match
    function onCancel(id: string) {
        axios.put(`/api/match/${id}/operation/cancel`, {
            cancelTime: new Date()
        })
            .then(()=>router.reload())
            .catch(()=>{
                setNetworkError("error cancelling match");
            });
    }

    //function to remove from match
    function onLeave(id: string) {
        axios.put(`/api/match/${id}/operation/remove`, {
            userName: session?.user.userName
        })
            .then(()=>router.reload())
            .catch(()=>{
                setNetworkError("error leaving match");
            });
    }

    return (
        <article className="w-full text-base m-auto my-5 bg-white rounded-lg">
            <SnackBar
                open={networkError !== ""}
                onClose={() => setNetworkError("")}
                duration={6000}
            >
                <span className="text-base text-red-400">
                    {networkError}
                </span>
            </SnackBar>
            <div className="w-full flex flex-col p-5 pt-2">
                {/* The starting time of the match*/}
                <div className="w-full font-bold">
                    <p>
                        {
                            props.matchStart?
                                dateConverter(new Date(props.matchStart), true):
                                "now"
                        }
                    </p>
                </div>
                {/* The type of sport of the match*/}
                <div className="text-gray-500">
                    <p>{props.sport}</p>
                </div>
            </div>
            <div className={
                `flex flex-row 
                    items-center justify-between 
                    rounded-lg rounded-t-none
                    bg-[#fc5c3e] p-3`
            }>
                {/* The type of sport of the match*/}
                <p className="truncate ... w-40 text-sm">
                    {props.location.address.fullAddress}
                </p>
                { (props.status === "UPCOMING" ||
                        props.status === "INPROGRESS") &&
                        <>
                            { session?.user.id === props.matchHost?
                                <button
                                    className={
                                        `rounded-lg bg-white
                                         text-orange-500 px-3 
                                         py-1 shadow-md shadow-black/30`
                                    }
                                    onClick={() => onCancel(props._id!.toString())}
                                >
                                    Cancel
                                </button> :
                                <>
                                    { props.status === "UPCOMING" &&
                                        <button
                                            className=""
                                            onClick={()=>onLeave(props._id!.toString())}
                                        >
                                            Leave
                                        </button>
                                    }
                                </>
                            }
                        </>
                }
            </div>
        </article>
    );
}