
import Link from "next/link"
import { useEffect } from "react"
import Image from "next/image"

export default function Header(){

  return (
    <header>
      <div>
        
        <div className="hidden space-x-8 md:flex cursor-pointer text-lg  font-semibold  ">
          <Link className="headerLink" href="/">RANKING</Link>
          <Link className="headerLink" href="#">MATCHES</Link>
          <Link className="headerLink" href="#">CREATE MATCH</Link>
          <Link className="headerLink" href="#">CATEGORY</Link>
          <Link className="headerLink" href="#">HISTORY</Link>
        </div>
      </div>
      <div >
        <div className="space-x-8 md:flex cursor-pointer text-lg font-semibold">
          <Link className="rightLink" href="/login">LOGIN</Link>
          <Link className="rightLink" href="/signup">SIGNUP</Link>
        </div>
      </div>
    </header>
    
  )
}
