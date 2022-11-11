// Third-party imports
import { ReactNode, ChangeEvent } from "react";

/**
 * option type of select option component
 * @property {string} value - value of option
 * @property {string} name - text that will be displayed
 */
interface Option {
  value: string;
  name: string;
}

/**
 * props type of select component
 * @property {string} label - input label
 * @property {string} name - input name
 * @property {string} value - input value
 * @property {(e: ChangeEvent)=>void} onChange - handle input change
 * @property {ReactNode} children - all the options of select
 */
interface Props {
  children?: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: Option[];
  name?: string;
}

/**
 * Select option component is used in the create match page for user select match type and sports.
 * @prop {string} label - input label
 * @prop {string} name - input name
 * @prop {string} value - input value
 * @prop {(e: ChangeEvent)=>void} onChange - handle input change
 * @prop {ReactNode} children - all the options of select
 * @returns {JSX.Element} - select option component
 */
export default function SelectOption(props: Props) {
    return (
        <div className="w-full">
            <div className="flex justify-left my-2">
                <label className="text-[#f3f2ef]">{props.label}</label>
            </div>
            <div className="bg-[#f1ecec] flex items-center select-none px-3 py-2 rounded-md gap-3">
                {props.children}
                <select
                    id="selected"
                    name={props.name}
                    value={props.value}
                    className=" w-full text-[#31302f]"
                    onChange={props.onChange}
                >
                    {props.options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
