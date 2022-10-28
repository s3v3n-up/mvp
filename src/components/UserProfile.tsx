import Image from "next/image"
import Input from "../components/Input"
import {Person,FolderSharedOutlined, Email} from '@mui/icons-material';

export default function UserProfile(){
  return (
    <div className="flex justify-evenly">
      <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
          <Image src="/bg.png" layout="fill" alt="black"/> 
      </div>
      <div className="flex w-1/4 flex-col space-y-3 lg:justify-end">
        <img src="/mvp-logo.png" alt="" width={150} height={100}/>
        <Input text="Full Name" icon=<Person/> value=""  />
        <Input text="User Name" icon=<FolderSharedOutlined/>  value=""  />
        <Input text="Email" icon=<Email/> value="" />
      </div>
    </div>
  )
}