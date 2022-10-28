import Props from "@/Interface/interface"

export default function SelectOption(props:Props){
  return (
    <div>
      <div className='flex justify-left my-2 '>
        <label className="text-[#f3f2ef]" >{props.text} </label>
      </div>
      <div className='flex '>
        <div className="py-2 pl-2 absolute">
          {props.icon}
        </div>
        <select  className="rounded-sm w-full text-center bg-[#f1ecec] h-8 p-5 text-[#31302f]" >
          <option value="sports">{props.option}</option>
          <option value="sports">{props.option}</option>
          <option value="sports">{props.option}</option>
          <option value="sports">{props.option}</option>
        </select>
      </div>
    </div>
  )
}