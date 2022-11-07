import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Cancel() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            router.push("/login");
        }
    },[status, router]);

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



