//third party imports
import { useState, ChangeEvent, useContext } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";

//local imports
import Input from "@/components/Input";
import { AvatarContext } from "@/context/avatar";
import { UserProfile } from "@/lib/types/User";
import { PHONE_REGEX } from "@/lib/helpers/validation";
import { useSession } from "next-auth/react";

//dynamic imports
const Person = dynamic(
    () => import("@mui/icons-material/Person"), { ssr: false }
);
const FolderSharedOutlined = dynamic(
    () => import("@mui/icons-material/FolderSharedOutlined"), { ssr: false }
);
const Email = dynamic(
    () => import("@mui/icons-material/Email"), { ssr: false }
);
const Phone = dynamic(
    () => import("@mui/icons-material/Phone"), { ssr: false }
);
const ImagePicker = dynamic(
    ()=>import("@/components/imagepicker"), { ssr: false }
);

/**
 * interface for type of user data
 */
interface Props {
  profile: UserProfile,
  userStats: {
    win: number;
    lose: number;
    draw: number;
  };
}

/*
 * this component is used in profile page, which shows user's firstname, lastname, username, phone, email and avatar.
 *  user also can edit their profile(firstname, lastname and phone)
 */
export default function Profile({ profile, userStats }: Props) {

    //get the user session
    const { data: session } = useSession();

    //get the user data
    const avatarContext = useContext(AvatarContext);

    //set the initial state and setState using useState
    const [firstName,setFirstName] = useState(profile.firstName);
    const [lastName,setLastName] = useState(profile.lastName);
    const [userName,setUserName] = useState(profile.userName);
    const [email,setEmail] = useState(profile.email);
    const [phone,setPhone] = useState(profile.phoneNumber);

    //set initial image as logo if user didn't upload their avatar
    const [image,setImage] = useState(profile.image);
    const [updatedImage, setUpdatedImage] = useState<File | null>(null);
    const [stats, setStats] = useState(userStats);

    //get the user firstname input value, update it in the db through axios put api
    const fNameHandle = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        //get and set the user firstname state
        const value = event.target.value;
        setFirstName(value);

        //validate the user firstname
        if (value.length <= 2) return;

        //update the user firstname in the db
        debounce(async () => {
            await axios.put(`/api/user/${userName}`, {
                userName: session?.user.userName,
                firstName: value,
                lastName,
                phoneNumber: phone,
                email: session?.user.email,
                image
            });
        }
        ,300)();
    };

    //get the user lastname input value, update it in the db through axios put api
    const lNameHandle = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        //get and set the lastname state
        const value = event.target.value;
        setLastName(value);

        //validate the lastname
        if (value.length <= 2) return;
        debounce(async () => {
            await axios.put(`/api/user/${userName}`, {
                userName: session?.user.userName,
                email: session?.user.email,
                firstName,
                lastName: value,
                phoneNumber: phone,
                image
            });
        },300)();
    };

    //get the user phone input value, update it in the db through axios put api
    const phoneHandle = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        //get and set the phone state
        const value = event.target.value;
        setPhone(value);

        //validate the phone
        if (!PHONE_REGEX.test(value)) return;

        //update the user phonenumber in the db
        debounce(async () => {
            await axios.put(`/api/user/${userName}`, {
                userName: session?.user.userName,
                email: session?.user.email,
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

        //get and set the image updated state
        const file = e.target.files![0];
        setUpdatedImage(file);

        //check if image is valid
        if (!file) return;

        //upload image to cloudinary and update user image in the db
        const data = new FormData();
        data.append("files", file);
        try {
            const res = await axios.post("/api/file", data);
            const { data: { data: { url: imageUrl } } } = res;
            await axios.put(`/api/user/${userName}`, {
                userName: session?.user.userName,
                email: session?.user.email,
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
