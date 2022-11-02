import Input from "../components/Input";
import { Person, FolderSharedOutlined, Phone } from "@mui/icons-material";
import Image from "next/image";

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
  }
}

/*
 * this component is for viewprofile page
 * @param { Data } data - data of user to display profile
 * @return display the other user's profile:fullname, username, phone, avatar, stats
 */
export default function ViewUserProfile({ data }: { data: Data }) {
    return (
        <div className="flex justify-evenly pt-10">
            <div className="flex w-1/4 flex-col space-y-3 lg:justify-end mt-10">
                <div className="relative w-40 h-40 rounded-full m-auto mb-5">
                    <Image
                        src={data.image}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        alt="avatar"
                        className="rounded-full"
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
