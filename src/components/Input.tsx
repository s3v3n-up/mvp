import { ReactNode, ChangeEvent } from "react";

/*
 * interface for input type: value,label,type,option,name
 */
interface Props {
  value: string;
  label?: string;
  type?: "text" | "password" | "email" | "datetime-local" | "tel" ;
  option?:string;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
}

/**
 * this input component which can be reused in any user input field.
 */
export default function Input(props:Props){
    return (
        <>
            <div className="flex justify-left my-2">
                <label className="text-[#f3f2ef]" >{props.label}</label>
            </div>
            <div className="flex items-center bg-[#f1ecec] p-2 gap-3 rounded-md w-full select-none">
                {props.children}
                <input
                    className="w-full text-[#31302f]"
                    type={props.type}
                    value={props.value}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                    name={props.name}
                />
            </div>
        </>
    );
}