import Image from "next/image";
import Link from "next/link";
import Input from "../components/Input"
import SelectOption from "./SelectOption";
import { AddLocationAlt, SportsBasketball, PeopleAlt, AccessTime} from '@mui/icons-material';

export default function CreateMatch(){
  return (
    <div className=" flex justify-evenly">
      <div className="flex flex-col space-y-2 lg:justify-end ">
        <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
          <Image src="/bg.png" layout="fill" alt="green"/> 
        </div>
        <div mt-15>
          <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">Create a Match</h1>
        </div>
        <form action="">
          <Input text="Location" icon=<AddLocationAlt/>  />
          <SelectOption text="Sport" option="Tennis" icon=<SportsBasketball/> />
          <SelectOption text="Type of Match" option="1 vs 1" icon=<PeopleAlt/> />
          <Input text="Date and Time" type="datetime-local" icon=<AccessTime/> />
          <Input text="Description" type="textarea" />
        </form>
        <div className="flex justify-center pt-5 cursor-pointer">
          <button className="rounded-sm w-80 bg-[#fc5c3e] h-10  font-extrabold  text-[#f1ecec]" >CREATE</button>
        </div>
      </div>
  
    </div>
    )
}