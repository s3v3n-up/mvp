import Image from "next/image";
import Input from "../components/Input";
import { Person, FolderSharedOutlined, Email } from "@mui/icons-material";
import { useState, ChangeEvent } from "react";

/**
 * interface for type of user data
 */
interface Data {
  fullName: string;
  userName: string;
  email: string;
}

/*
 * this component is used in profile page, which shows user's fullname, username and email
 */
export default function UserProfile() {
    const [data, setData] = useState<Data>({
        fullName: "",
        userName: "",
        email: "",
    });

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
        <div className="flex justify-evenly pt-10">
            <div className="flex w-1/4 flex-col space-y-3 lg:justify-end">
                <div className="relative w-40 h-40 rounded-full m-auto mb-5">
                    <Image
                        src="https://i.pravatar.cc/300?img=2"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        alt="logo"
                        className="rounded-full"
                    />
                </div>
                <Input
                    label="Full Name"
                    value={data.fullName}
                    name="fullname"
                    onChange={handleInputChange}
                >
                    <Person />
                </Input>
                <Input
                    label="User Name"
                    value={data.userName}
                    name="username"
                    onChange={handleInputChange}
                >
                    <FolderSharedOutlined />
                </Input>
                <Input
                    label="Email"
                    value={data.email}
                    name="email"
                    onChange={handleInputChange}
                >
                    <Email />
                </Input>
            </div>
        </div>
    );
}
