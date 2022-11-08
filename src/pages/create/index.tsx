//third party import
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";

//dynamic import
const ElectricBoltIcon = dynamic(
    () => import("@mui/icons-material/ElectricBolt"),
    { ssr: false }
);
const LocalFireDepartmentIcon = dynamic(
    () => import("@mui/icons-material/LocalFireDepartment"),
    { ssr: false }
);

export default function CreateMatch() {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>MVP | Create Match</title>
                <meta name="description" content="Create page" />
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <section>
                <h1 className="text-white text-3xl font-bold text-center mt-10">
          Create Match
                </h1>
                <div
                    className={`px-5 
                py-3 lg:w-3/5 
                m-auto mt-5 flex
                items-center justify-center
                gap-10 rounded-md
                text-white font-bold
                w-4/5 flex-wrap
                `}
                >
                    <button
                        className={`
                        bg-[#172123] bg-opacity-75 
                        p-40 text-3xl 
                        w-56 h-56 mt-5
                        rounded-lg drop-shadow-lg`}
                        onClick={() => router.push("/create/regularmatch")}
                    >
                        <LocalFireDepartmentIcon
                            sx={{ marginBottom: "2rem", color: "red" }}
                            fontSize="large"
                        />
                        <br />
            Regular
                        <br />
            Match
                    </button>
                    <button
                        className={`bg-[#172123] bg-opacity-75
                        p-30 text-3xl 
                        w-56 h-56 mt-5 rounded-lg
                        drop-shadow-lg`}
                        onClick={() => router.push("/create/quickmatch")}
                    >
                        <ElectricBoltIcon
                            sx={{ marginBottom: "2rem", color: "orange" }}
                            fontSize="large"
                        />
                        <br />
            Quick
                        <br />
            Match
                    </button>
                </div>
            </section>
        </>

    );
}
