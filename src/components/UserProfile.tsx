import Image from "next/image";
import Input from "../components/Input";
import { Person, FolderSharedOutlined, Email } from "@mui/icons-material";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import { ProfileContext } from "@/context/profile";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/lib/types/User";
import axios from "axios";

/**
 * interface for type of user data
 */
interface Data {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  image: string;
  stats: {
    win: number;
    lose: number;
    draw: number;
  };
}

/*
 * this component is used in profile page, which shows user's firstname, lastname, username, email and avatar
 */
export default function Profile() {

    //get the session
    const { data: session } = useSession();

    //set the initial state and setState using useState
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [image,setImage] = useState("/img/logo.png");
    const [stats, setStats] = useState({ win:0, lose:0, draw:0 });
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (session && session.user && isDataLoaded === false) {
            Promise.all(
                [
                    axios.get(`/api/user/${session.user.userName}`),
                    axios.get(`/api/user/${session.user.userName}/stats`)
                ]).then(data => {
                const [{ data:userData },{ data:userStats }] = data as unknown as [{data:UserProfile}, {data:{win:number,lose:number,draw:number}}];
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setUserName(userData.userName);
                setPhone(userData.phoneNumber);
                setEmail(userData.email);
                setImage(userData.image);
                setStats(userStats);
                setIsDataLoaded(true);

                // console.log(userData);
                // console.log(userStats);
            }
            ).catch(error=>console.log(error));
        }
    }, [isDataLoaded, session]);



    /*
   *this function is to catch the user input value
   */
    const fNameHandle = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const value = event.target.value;
        setFirstName(value);
        await axios.put(`/api/user/${userName}`, {
            firstName: event.target.value,
            lastName,
            phoneNumber: phone,
            image
        });
    };

    const lNameHandle = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const value = event.target.value;
        setLastName(value);
        await axios.put(`/api/user/${userName}`, {
            firstName,
            lastName: event.target.value,
            phoneNumber: phone,
            image
        });
    };

    const phoneHandle = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const value = event.target.value;
        setPhone(value);
        await axios.put(`/api/user/${userName}`, {
            firstName,
            lastName,
            phoneNumber: event.target.value,
            image
        });
    };


    return (
        <div className="flex justify-evenly pt-10">
            <div className="flex w-1/4 flex-col space-y-3 lg:justify-end">
                {isDataLoaded === false && "...Loading"}
                <div className="relative w-40 h-40 rounded-full m-auto mb-5 bg-white">
                    <Image
                        src={image}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        alt="logo"
                        className="rounded-full"
                    />
                </div>
                <Input
                    label="First Name"
                    value={firstName}
                    name="firstName"
                    onChange={fNameHandle}
                >
                    <Person />
                </Input>
                <Input
                    label="Last Name"
                    value={lastName}
                    name="lastName"
                    onChange={lNameHandle}
                >
                    <Person />
                </Input>
                <Input
                    label="User Name"
                    value={userName}
                    name="userName"
                    readonly
                >
                    <FolderSharedOutlined />
                </Input>
                <Input
                    label="Phone"
                    value={phone}
                    name="phone"
                    onChange={phoneHandle}
                >
                    <FolderSharedOutlined />
                </Input>
                <Input
                    label="Email"
                    value={email}
                    name="email"
                    readonly
                >
                    <Email />
                </Input>
                <table className=" border-collapse border border-slate-800 rounded-ml text-center mt-6 ">
                    <thead className=" bg-[#fc5c3e] text-[#f3f2ef] my-5 py-5 mt-6">
                        <tr className="my-5 py-5 mt-6">
                            <th>Win</th>
                            <th>Draw</th>
                            <th>Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className=" bg-white text-black">
                            <td>{stats.win}</td>
                            <td>{stats.draw}</td>
                            <td>{stats.lose}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

