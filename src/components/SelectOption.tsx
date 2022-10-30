import {ReactNode,ChangeEvent} from "react";

interface Option {
  value: string;
  name: string;
}

interface Props {
  children?: ReactNode;
  value: string;
  onChange: (e:ChangeEvent<HTMLSelectElement>)=>void;
  label: string;
  options: Option[];
  name?: string;
}

/**
 * 
 * options {value, name, key} 
 * 
 */

export default function SelectOption(props:Props){
  return (
    <div>
      <div className="flex justify-left my-2">
        <label className="text-[#f3f2ef]" >{props.label}</label>
      </div>
      <div className="flex">
        <div className="py-2 pl-2 absolute" >
          {props.children}
        </div>
        <select id="selected" className="rounded-sm w-full text-center bg-[#f1ecec] h-8 p-5 text-[#31302f]" >
          {props.options.map((option, idx)=> 
            <option key={idx} value={option.value}> {option.name} </option>
          )}
        </select>
      </div>
    </div>
  )
}