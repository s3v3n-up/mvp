import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function NavTab({ href, pageName, children }: {href: string, pageName: string, children?: ReactNode}) {

    //check if tab is active
    const router = useRouter();
    const isActive = router.pathname === href;

    return (
        <Link href={href}>
            <li className={
                `${isActive? "text-orange-500": "text-white"}
                flex flex-col 
                items-center font-bold
                cursor-pointer uppercase`
            }>
                {children}
                {pageName}
            </li>
        </Link>
    );
}