import Image from "next/image";
import useAuth from "@/hooks/useAuth";

export default function Cancel() {

    //guard page against unauthenticated users on client side
    useAuth();

    return (
        <section>
            <h1 className={
                `text-center sm:text-4xl 
                font-bold text-orange-500 
                mt-40 text-2xl`
            }>
                ⚠️ MATCH HAS BEEN CANCELLED
            </h1>
            <div className={
                `relative sm:w-44 
                sm:h-44 w-14 
                h-14 m-auto 
                sm:mt-14 mt-5`
            }>
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



