import { ReactNode } from "react";
import HistoryTab from "./tab";

/**
 * props type of history layout component
 * @property {ReactNode} children - main content of history layout
 */
interface Props {
    setTab: (tab: "present" | "past") => void;
    currTab: "present" | "past"
    children: ReactNode;
}

export default function HistoryLayout(props: Props) {
    return (
        <section className="lg:w-2/5 sm:3/5 m-auto w-11/12">
            <header className="w-full mt-10 sticky top-10 z-50">
                <ul className={
                    `w-full rounded-lg 
                    flex justify-between 
                    items-center bg-[#fc5c3e]
                    p-1 shadow-lg shadow-orange-500/40`
                }>
                    <HistoryTab
                        isActive={props.currTab === "present"}
                        name= "Created Match"
                        setActive={props.setTab}
                        tab="present"

                    />
                    <HistoryTab
                        isActive={props.currTab==="past"}
                        name="History"
                        setActive={props.setTab}
                        tab="past"
                    />
                </ul>
            </header>
            <main>
                {props.children}
            </main>
        </section>
    );
}
