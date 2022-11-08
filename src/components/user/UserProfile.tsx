//third party imports
import Image from "next/image";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";

//local imports
import Input from "@/components/Input";
import { AvatarContext } from "@/context/avatar";
import AlertMessage from "../alertMessage";
import { UserProfile } from "@/lib/types/User";
import { PHONE_REGEX } from "@/lib/helpers/validation";

//dynamic imports
const Person = dynamic(() => import("@mui/icons-material/Person"));
const FolderSharedOutlined = dynamic(() => import("@mui/icons-material/FolderSharedOutlined"));
const Email = dynamic(() => import("@mui/icons-material/Email"));
const Phone = dynamic(() => import("@mui/icons-material/Phone"));
const ImagePicker = dynamic(()=>import("@/components/imagepicker"));

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
 * this component is used in profile page, which shows user's firstname, lastname, username, phone, email and avatar.
 *  user also can edit their profile(firstname, lastname and phone)
 */
export default function Profile() {

    //get the session
    const { data: session } = useSession();

    //get the user data
    const avatarContext = useContext(AvatarContext);

    //set the initial state and setState using useState
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");

    //set initial image as logo if user didn't upload their avatar
    const [image,setImage] = useState("/img/logo.png");
    const [updatedImage, setUpdatedImage] = useState<File | null>(null);
    const [stats, setStats] = useState({ win:0, lose:0, draw:0 });
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    //axios to get the userdata and stats from api
    useEffect(() => {
        if (session && session.user && isDataLoaded === false) {
            Promise.all([
                axios.get(`/api/user/${session.user.userName}`),
                axios.get(`/api/user/${session.user.userName}/stats`)
            ]).then(data => {

                //destructure the object to userData and userStats
                const [{ data:userData },{ data:userStats }] = data as unknown as [{data:UserProfile}, {data:{win:number,lose:number,draw:number}}];
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setUserName(userData.userName);
                setPhone(userData.phoneNumber);
                setEmail(userData.email);
                setImage(userData.image);
                setStats(userStats);
                setIsDataLoaded(true);
            }
            ).catch(error=>console.log(error));
        }

        //when isDataloaded state and session change, useEffect executes.
    }, [isDataLoaded, session]);

    //get the user firstname input value, update it in the db through axios put api
    const fNameHandle = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const value = event.target.value;
        setFirstName(value);
        if (value.length <= 2) return;
        debounce(async () => {
            await axios.put(`/api/user/${userName}`, {
                firstName: value,
                lastName,
                phoneNumber: phone,
                image
            });
        }
        ,300)();
    };

    //get the user lastname input value, update it in the db through axios put api
    const lNameHandle = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const value = event.target.value;
        setLastName(value);
        if (value.length <= 2) return;
        debounce(async () => {
            await axios.put(`/api/user/${userName}`, {
                firstName,
                lastName: value,
                phoneNumber: phone,
                image
            });
        },300)();
    };

    //get the user phone input value, update it in the db through axios put api
    const phoneHandle = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const value = event.target.value;
        setPhone(value);
        if (!PHONE_REGEX.test(value)) return;
        debounce(async () => {
            await axios.put(`/api/user/${userName}`, {
                firstName,
                lastName,
                phoneNumber: value,
                image
            });
        },300)();
    };

    /**
     * handle update image
     */
    const handleImageChange = debounce(async(e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setUpdatedImage(file);
        if (!file) return;
        const data = new FormData();
        data.append("files", file);
        try {
            const res = await axios.post("/api/file", data);
            const { data: { data: { url: imageUrl } } } = res;
            await axios.put(`/api/user/${userName}`, {
                firstName,
                lastName,
                phoneNumber: phone,
                image: imageUrl
            });
            avatarContext?.setCurrAvatar(imageUrl);
            setImage(imageUrl);
        } catch {
            setUpdatedImage(null);
            alert("error update image, you file could be too large or try again later");
        }
    }, 500);

    /**
     * handle remove updated image of image picker
     */
    const handleRemoveImage = debounce(async()=>{
        setUpdatedImage(null);
    }, 500);

    return (
        <div className="flex justify-evenly pt-10">
            <div className="flex lg:w-1/4 w-4/5 flex-col space-y-3">
                {isDataLoaded === false && "...Loading"}
                <ImagePicker
                    imageUrl={image}
                    image={updatedImage}
                    onChange={handleImageChange}
                    onRemove={handleRemoveImage}
                />
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
                    <Phone />
                </Input>
                <Input
                    label="Email"
                    value={email}
                    name="email"
                    readonly
                >
                    <Email />
                </Input>
                <p className="mt-3 text-white text-base">Stat</p>
                <table className="text-base border-collapse border border-slate-800 rounded-ml text-center mt-6 ">
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

