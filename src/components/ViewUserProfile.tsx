import Input from "../components/Input"
import {Person,FolderSharedOutlined, Phone} from '@mui/icons-material';
import Image from "next/image";

export default function ViewUserProfile(){
  return (
    <div className="flex justify-evenly">
      <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
          <Image src="/bg.png" layout="fill" alt="black"/> 
      </div>
      <div className="flex w-1/4 flex-col space-y-3 lg:justify-end">
        <img src="/mvp-logo.png" alt="" width={150} height={100}/>
        <Input text="Full Name" icon=<Person/> value="" />
        <Input text="User Name" icon=<FolderSharedOutlined/> value="" />
        <Input text="Contact" icon=<Phone/> value="" />
        <table className=" border-collapse border border-slate-800 rounded-ml text-center mt-6 ">
          <thead className=" bg-[#fc5c3e] text-[#f3f2ef] my-5 py-5 mt-6" >
            <tr className="my-5 py-5 mt-6">
              <th>Win</th>
              <th>Draw</th>
              <th>Loss</th>
            </tr>
          </thead>
          <tbody >
            <tr className=" bg-white text-black">
              <td>10</td>
              <td>3</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}