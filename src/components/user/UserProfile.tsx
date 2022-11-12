//third party imports
import { useState, ChangeEvent, useContext } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";

//local imports
import Input from "@/components/Input";
import { AvatarContext } from "@/context/avatar";
import { UserProfile } from "@/lib/types/User";
import { firstNameSchema, lastNameSchema, phoneNumberSchema } from "@/shared/schema";

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

const AlertMessage = dynamic(() => import("@/components/alertMessage"), {
    ssr: false,
});

/**
 * interface for type of user data
 * @property {UserProfile} profile - user profile data
 * @property {win:number, lose:number, draw:number} stats - stats data
 */
interface Props {
  profile: UserProfile,
  userStats: {
    win: number;
    lose: number;
    draw: number;
  };
}

/**
 * this component is used in profile page, which shows user's firstname, lastname, username, phone, email and avatar.
 * user also can edit their profile(firstname, lastname and phone)
 * @prop {UserProfile} profile - user profile data
 * @prop {win:number, lose:number, draw:number} stats - stats data
 * @returns {JSX.Element} user profile component
 */
export default function Profile({ profile, userStats }: Props) {

    //get the user data
    const avatarContext = useContext(AvatarContext);

    //set the initial state and setState using useState
    const [firstName,setFirstName] = useState(profile.firstName);
    const [lastName,setLastName] = useState(profile.lastName);
    const [phone,setPhone] = useState(profile.phoneNumber);

    //user profile image
    const [image,setImage] = useState(profile.image);
    const [updatedImage, setUpdatedImage] = useState<File | null>(null);
    const [error, setError] = useState("");

    //get the user firstname input value, update it in the db through axios put api
    const fNameHandle = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        //get and set the user firstname state
        const value = event.target.value;
        setFirstName(value);
        try {

            // Checks if firstName is Valid
            const isValid = await firstNameSchema.validate({ firstName: value });

            // If firstName is valid
            if(isValid) {

                //update the user firstName in the db
                debounce(async () => {
                    await axios.put(`/api/user/${profile.userName}/firstName`, {
                        firstName: value
                    });
                },300)();
            }

        // Catches and sets the error message
        } catch(error: any) {
            setError(error.message);

            return;
        }
    };

    //get the user lastname input value, update it in the db through axios put api
    const lNameHandle = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        //get and set the lastname state
        const value = event.target.value;
        setLastName(value);

        try {

            // Checks if lastName is Valid
            const isValid = await lastNameSchema.validate({ lastName: value });

            // If phoneNumber is valid
            if(isValid) {

                //update the user lastName in the db
                debounce(async () => {
                    await axios.put(`/api/user/${profile.userName}/lastName`, {
                        lastName: value
                    });
                },300)();
            }

        // Catches and sets the error message
        } catch(error: any) {
            setError(error.message);

            return;
        }
    };

    //get the user phone input value, update it in the db through axios put api
    const phoneHandle = async (event: React.ChangeEvent<HTMLInputElement>) =>{

        //get and set the phone state
        const value = event.target.value;
        setPhone(value);

        try {

            // Checks if phoneNumber is Valid
            const isValid = await phoneNumberSchema.validate({ phoneNumber: value });

            // If phoneNumber is valid
            if(isValid) {

                //update the user phonenumber in the db
                debounce(async () => {
                    await axios.put(`/api/user/${profile.userName}/phoneNumber`, {
                        phoneNumber: value
                    });
                },300)();
            }

        // Catches and sets the error message
        } catch(error: any) {
            setError(error.message);

            return;
        }
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
            await axios.put(`/api/user/${profile.userName}/image`, {
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
                {error && <AlertMessage message={error} type="error" />}
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
                    value={profile.userName}
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
                    value={profile.email}
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
                            <td>{userStats.win}</td>
                            <td>{userStats.draw}</td>
                            <td>{userStats.lose}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
