//this is create match page component
import Image from "next/image";
import Input from "../components/Input";
import SelectOption from "./SelectOption";
import { ChangeEvent, useState } from "react";
import {
    AddLocationAlt,
    SportsBasketball,
    PeopleAlt,
    AccessTime,
} from "@mui/icons-material";

interface Data {
  location: string;
  sport: string;
  type: string;
  date: string;
}

export default function CreateMatch() {
    const [data, setData] = useState<Data>({
        location: "",
        sport: "",
        type: "",
        date: "",
    });
    const options = [
        { value: "tennis", name: "tennis" },
        { value: "badminton", name: "badminton" },
        { value: "basketball", name: "basketball" },
    ];

    function handleInputChange(
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setData({
            ...data,
            [e.target.name]: [e.target.value],
        });
    }

    return (
        <div className="flex justify-evenly">
            <div className="flex flex-col space-y-2 lg:justify-end ">
                <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
                    <Image src="/bg.png" layout="fill" alt="black" />
                </div>
                <div>
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">
            Create a Match
                    </h1>
                </div>
                <form action="">
                    <Input label="Location" value={data.location} name="location">
                        <AddLocationAlt />
                    </Input>
                    <SelectOption
                        label="Sport"
                        options={options}
                        value={data.type}
                        onChange={handleInputChange}
                    >
                        <SportsBasketball />
                    </SelectOption>
                    <SelectOption
                        label="Type of Match"
                        options={options}
                        value={data.type}
                        onChange={handleInputChange}
                    >
                        <PeopleAlt />
                    </SelectOption>
                    <Input
                        label="Date and Time"
                        value={data.date}
                        name="date"
                        type="datetime-local"
                    >
                        <AccessTime />
                    </Input>
                    <div className="my-2">
                        <label className="text-[#f3f2ef]" htmlFor="description">
              Description
                        </label>
                    </div>
                    <div>
                        <textarea
                            className="w-full rounded-sm"
                            required
                            rows={3}
                        ></textarea>
                    </div>
                </form>
                <div className="flex justify-center pt-5 cursor-pointer">
                    <button className="rounded-sm w-80 bg-[#fc5c3e] h-10  font-extrabold  text-[#f1ecec]">
            CREATE
                    </button>
                </div>
            </div>
        </div>
    );
}
