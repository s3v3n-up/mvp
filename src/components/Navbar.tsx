import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="top-0 z-50 flex w-full items-center justify-between px-4 py-4 text-[#f3f2ef] ">
      <div className="flex items-center space-x-2 md:space-x-10">
        <div>
          <Image
            src="/mvp-logo.png"
            width={120}
            height={100}
            alt="logo"
          ></Image>
        </div>
        <div className="hidden space-x-8 md:flex cursor-pointer text-lg  font-semibold  ">
          <Link className="headerLink" href="/">
            RANKING
          </Link>
          <Link className="headerLink" href="#">
            MATCHES
          </Link>
          <Link className="headerLink" href="/create">
            CREATE MATCH
          </Link>
          <Link className="headerLink" href="#">
            CATEGORY
          </Link>
          <Link className="headerLink" href="#">
            HISTORY
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-10 mr-10">
        <div className="space-x-8 md:flex cursor-pointer text-lg  font-semibold ">
          <Link className="rightLink " href="/login">
            LOGIN
          </Link>
          <Link className="rightLink" href="/signup">
            SIGNUP
          </Link>
        </div>
      </div>
    </header>
  );
}
