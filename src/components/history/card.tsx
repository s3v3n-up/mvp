import type { Match } from "@/lib/types/Match";
import { dateConverter } from "@/lib/helpers/time";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import SnackBar from "../snackbar";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Card(props: Match) {
    const { session } = useAuth();
    const router = useRouter();

    //network error state
    const [networkError, setNetworkError] = useState("");

    // Function to delete match and refresh page
    function onCancel(id: string) {
        axios.put(`/api/match/${id}/operation/cancel`, {
            cancelTime: new Date()
        })
            .then(()=>router.reload())
            .catch(()=>{
                setNetworkError("error cancelling match");
            });
    }

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
        <article className="w-full">
            <SnackBar
                open={networkError !== ""}
                onClose={() => setNetworkError("")}
                duration={6000}
            >
                <span className="text-base text-red-400">
                    {networkError}
                </span>
            </SnackBar>
            <div className="w-full">
                {/* The starting time of the match*/}
                <div className="">
                    <p>
                        {
                            props.matchStart?
                                dateConverter(new Date(props.matchStart), true):
                                "now"
                        }
                    </p>
                </div>
                {/* The type of sport of the match*/}
                <div className="">
                    <p>{props.sport}</p>
                </div>
                <div className="">
                    {/* The type of sport of the match*/}
                    <div className="truncate ...">
                        <p>{props.location.address.fullAddress}</p>
                    </div>
                    { (props.status === "UPCOMING" ||
                        props.status === "INPROGRESS") &&
                        <>
                            { session?.user.id === props.matchHost?
                                <button
                                    className=""
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
            </div>
        </article>
    );
}