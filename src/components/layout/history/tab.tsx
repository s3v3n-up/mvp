interface Props {
    isActive: boolean;
    tab: "present" | "past";
    name: string;
    setActive: (name: "present" | "past") => void;
}

export default function HistoryTab(props: Props) {
    return (
        <li
            className={
                `flex justify-center 
                items-center w-full
                cursor-pointer select-none`
            }
            onClick={()=>props.setActive(props.tab)}
        >
            <div className={
                `w-full rounded-lg 
                p-3 flex 
                justify-center items-center
                ease duration-300
                select-none
                ${!props.isActive ? "bg-[#fc5c3e]" : "bg-[#1a1a1a]"}`
            }>
                <p className={
                    `sm:text-lg text-base 
                    font-bold select-none
                    ${!props.isActive ? "text-[#f3f2ef]" : "text-orange-500"}`
                }>
                    {props.name}
                </p>
            </div>
        </li>
    );
}