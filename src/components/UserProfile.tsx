//this component is used in profile page, which shows user's fullname, username and email
import Image from "next/image";
import Input from "../components/Input";
import { Person,FolderSharedOutlined, Email } from "@mui/icons-material";
import { useState,ChangeEvent } from "react";

interface Data {
  fullName: string,
  userName: string,
  email: string
}

export default function UserProfile() {
    const [data, setData] = useState<Data>({
        fullName: "",
        userName: "",
        email: ""
    });

    function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement> ) {
        setData(({
            ...data,
            [e.target.name]: [e.target.value]
        }));
    }

    return (
        <div className="flex justify-evenly">
            <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
                <Image src="/bg.png" layout="fill" alt="black"/>
            </div>
            <div className="flex w-1/4 flex-col space-y-3 lg:justify-end">
                <Image src="/mvp-logo.png" width={150} height={100} alt="logo"></Image>
                <Input label="Full Name" value={data.fullName} name="fullname" onChange={handleInputChange}>
                    <Person/>
                </Input>
                <Input label="User Name" value={data.userName} name="username" onChange={handleInputChange}>
                    <FolderSharedOutlined/>
                </Input>
                <Input label="Email" value={data.email} name="email" onChange={handleInputChange}>
                    <Email/>
                </Input>
            </div>
        </div>
    );
}