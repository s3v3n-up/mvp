import Image from "next/image";
import useAuth from "@/hooks/useAuth";

export default function Cancel() {

    //guard page against unauthenticated users on client side
    useAuth();

    return (
        <section>
            <h1 className="text-center text-4xl font-bold text-orange-500 mt-40">⚠️ MATCH HAS BEEN CANCELLED</h1>
            <div className="relative w-44 h-44 m-auto mt-14">
                <Image
                    src={"/icons/skull.png"}
                    alt="skull"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
        </section>
    );
}



