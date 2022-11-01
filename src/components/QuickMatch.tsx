import Image from "next/image";
import Input from "./Input";
import SelectOption from "./SelectOption";
import { ChangeEvent, useState } from "react";
import { AddLocationAlt,SportsBasketball,PeopleAlt } from "@mui/icons-material";

/*
 * interface for type of match
 */
interface Data {
  location: string;
  sport: string;
  type: string;
}

/*
 * this component is used in create match page
 */
export default function QuickMatch() {
    const [data, setData] = useState<Data>({
        location: "",
        sport: "",
        type: "",
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
        <div className="flex justify-evenly mt-10">
            <div className="flex flex-col space-y-2 lg:justify-end ">
                <div>
                    <h1 className="text-[#f3f2ef] text-3xl text-center pt-3">
                        Create Quick Match
                    </h1>
                </div>
                <form action="">
                    <Input label="Location" value={data.location} name="location">
                        <AddLocationAlt />
                    </Input>
                    <SelectOption
                        label="Sport"
                        options={options}
                        value={data.sport}
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
