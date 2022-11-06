// Third-party imports
import { ReactNode, ChangeEvent } from "react";

/*
 * interface for the type of option which included name and value.
 */
interface Option {
  value: string;
  name: string;
}

/*
 * interface for the type of input.
 */
interface Props {
  children?: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: Option[];
  name?: string;
}

/*
 * Select option component is used in the create match page for user select match type and sports.
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
