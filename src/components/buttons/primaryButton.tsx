import { ReactNode } from "react";

interface Props {
    children?: ReactNode;
    onClick?: () => void;
    type: "button" | "submit";
    className?: string;
}

/**
 * *
 * @description this  a button component
 */
export default function PrimaryButton(props: Props) {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            className= {`bg-[#fc5c3e] text-white px-4 py-3 rounded-md ${props.className}`}
        >
            {props.children}
        </button>
    );
}
