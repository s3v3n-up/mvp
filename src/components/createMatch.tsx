import Image from "next/image";
import Input from "./Input";
import SelectOption from "./SelectOption";
import { ChangeEvent, useState } from "react";
import {
    AddLocationAlt,
    SportsBasketball,
    PeopleAlt,
    AccessTime,
} from "@mui/icons-material";

/*
 * interface for type of match
 */
interface Data {
  location: string;
  sport: string;
  type: string;
  date: string;
}

/*
 * this component is used in create match page
 */
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

    /*
   *this function is to catch the user input value
   */
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
                <div className="mt-5">
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">
                        Create a Match
                    </h1>
                </div>
                <form action="">
                    <Input label="Location" value={data.location} name="location" onChange={handleInputChange}>
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
                        onChange={handleInputChange}
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
                            className="w-full rounded-md bg-[##f1ecec] px-3 py-2"
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
