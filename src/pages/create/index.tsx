//third party import
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

//dynamic import
const ElectricBoltIcon = dynamic(()=> import("@mui/icons-material/ElectricBolt"), { ssr: false });
const LocalFireDepartmentIcon = dynamic(()=>import("@mui/icons-material/LocalFireDepartment"), { ssr: false });

export default function CreateMatch() {
    const router = useRouter();

    return (
        <section>
            <h1 className="text-white text-3xl font-bold text-center mt-10">Create Match</h1>
            <div className={
                `px-5 
                py-3 lg:w-3/5 
                m-auto mt-5 flex
                items-center justify-center
                gap-10 rounded-md
                text-white font-bold
                w-4/5 flex-wrap
                `
            }>
                <button
                    className={`
                        bg-[#172123] bg-opacity-75 
                        p-40 text-3xl 
                        w-56 h-56 mt-5
                        flex items-center justify-center flex-col
                        rounded-lg drop-shadow-lg
                        hover:bg-opacity-100
                        hover:bg-[#fb923c]
                        ease-out duration-200
                        `
                    }
                    onClick={() => router.push("/create/regularmatch")}
                >
                    <LocalFireDepartmentIcon sx={ { marginBottom: "0.25rem", color: "red", fontSize: "5rem" }}/><br/>
                    Regular Match
                </button>
                <button
                    className={
                        `bg-[#172123] bg-opacity-75
                        p-40 text-3xl 
                        w-56 h-56 mt-5 rounded-lg
                        flex items-center justify-center flex-col
                        drop-shadow-lg
                        hover:bg-opacity-100
                        hover:bg-[#ef4444]
                        ease-out duration-200
                        `
                    }
                    onClick={() => router.push("/create/quickmatch")}
                >
                    <ElectricBoltIcon sx={ { marginBottom: "0.25rem", color: "orange", fontSize: "5rem" }}/><br/>
                    Quick Match
                </button>
            </div>
        </section>
    );
}