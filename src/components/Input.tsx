// this is input component which can be reused in any user input field.
import { ReactNode, ChangeEvent } from "react";

interface Props {
  value: string;
  label?: string;
  type?: "text" | "password" | "email" | "datetime-local" ;
  option?:string;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>)=>void;
  name?: string
}

export default function Input(props:Props){
    return (
        <>
            <div className="flex justify-left my-2">
                <label className="text-[#f3f2ef]" >{props.label}</label>
            </div>
            <div className="flex">
                <div className="py-2 pl-2 absolute">
                    {props.children}
                </div>
                <input
                    className="rounded-sm w-full text-center p-5 bg-[#f1ecec] h-8  text-[#31302f]"
                    type={props.type} value={props.value}
                    onChange={props.onChange}
                />
            </div>
        </>
    );
}