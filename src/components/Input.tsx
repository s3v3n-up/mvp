import { ReactNode, ChangeEvent } from "react";

/**
 * props type of input component
 * @property {string} label - input label
 * @property {string} name - input name
 * @property {string} value - input value
 * @property {(e: ChangeEvent)=>void} onChange - handle input change
 * @property {ReactNode} children - extra icon to be displayed
 * @property {string} type - input type
 * @property {boolean} readonly - is input readonly
 * @property {string} placeholder - input placeholder
 */
interface Props {
  value: string;
  label?: string;
  type?: "text" | "password" | "email" | "datetime-local" | "tel" ;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
}

/**
 * this input component which can be reused in any user input field.
 * @prop {string} label - input label
 * @prop {string} name - input name
 * @prop {string} value - input value
 * @prop {(e: ChangeEvent)=>void} onChange - handle input change
 * @prop {ReactNode} children - extra icon to be displayed
 * @prop {string} type - input type
 * @prop {boolean} readonly - is input readonly
 * @prop {string} placeholder - input placeholder
 * @returns {JSX.Element} - input component
 */
export default function Input(props:Props){
    return (
        <>
            <div className="flex justify-left my-2">
                <label className="text-[#f3f2ef] text-base" >{props.label}</label>
            </div>
            <div className="flex items-center bg-[#f1ecec] p-2 gap-3 rounded-md w-full select-none">
                {props.children}
                <input
                    className="w-full text-[#31302f] text-base"
                    type={props.type}
                    value={props.value}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                    name={props.name}
                    readOnly={props.readonly}
                />
            </div>
        </>
    );
}