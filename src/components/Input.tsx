import Props from "@/Interface/interface"

export default function Input(props:Props){
  return (
    <>
    <div className='flex justify-left my-2'>
      <label className="text-[#f3f2ef]" >{props.text}</label>
    </div>
    <div className='flex'>
      <div className="py-2 pl-2 absolute">
      {props.icon}
      </div>
      <input className="rounded-sm w-full text-center p-5 bg-[#f1ecec] h-8  text-[#31302f]" type={props.type} value={props.value} >
      </input>
    </div>
    </>
  )
}