//third party imports
import Image from "next/image";
import dynamic from "next/dynamic";

//local imports
import Input from "../Input";

//dynamic imports
const Person = dynamic(() => import("@mui/icons-material/Person"));
const Phone = dynamic(() => import("@mui/icons-material/Phone"));
const FolderSharedOutlined = dynamic(() => import("@mui/icons-material/FolderSharedOutlined"));

/*
 * type of user data
 */
export interface Data {
  fullName: string;
  userName: string;
  phone: string;
  image: string;
  stats: {
    win: number;
    lose: number;
    draw: number;
  };
}

/*
 * this component is for viewprofile page
 * @param { Data } data - data of user to display profile
 * @return display the other user's profile:fullname, username, phone, avatar, stats
 */
export default function ViewUserProfile({ data }: { data: Data }) {
    return (
        <div className="flex justify-evenly">
            <div className="flex lg:w-1/4 w-4/5 flex-col space-y-3 lg:justify-end mt-10">
                <div className="relative w-40 h-40 rounded-full m-auto mb-5">
                    <Image
                        src={data.image}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        alt="avatar"
                        className="rounded-full"
                        placeholder="blur"
                        blurDataURL="/img/logo.png"
                    />
                </div>
                <Input label="Full Name" value={data.fullName} name="fullname" readonly>
                    <Person />
                </Input>
                <Input label="User Name" value={data.userName} name="username" readonly>
                    <FolderSharedOutlined />
                </Input>
                <Input label="Phone" value={data.phone} name="phone" readonly>
                    <Phone />
                </Input>
                <p className="text-white mt-5 text-base">Stats</p>
                <table className=" text-base border-collapse border border-slate-800 rounded-ml text-center mt-6 ">
                    <thead className=" bg-[#fc5c3e] text-[#f3f2ef] my-5 py-5 mt-6">
                        <tr className="my-5 py-5 mt-6">
                            <th>Win</th>
                            <th>Draw</th>
                            <th>Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className=" bg-white text-black">
                            <td>{data.stats.win}</td>
                            <td>{data.stats.draw}</td>
                            <td>{data.stats.lose}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

