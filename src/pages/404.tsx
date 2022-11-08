//third-party import
import Link from "next/link";

/**
 * 404 page for any irregular request
 */
export default function NotFoundPage(){
    return (
        <div className="text-white text-center mt-32 flex-col">
            {/* container for error 404 content */}
            <div className=" bg-[#fc5c3e]/60 rounded-xl mx-56 py-8">
                <h1 className="text-3xl my-10">Ooops... Sorry!</h1>
                <h2 className="text-2xl">The page you are looking for that does not exist.</h2>
            </div>
            {/* button for redirect to home page */}
            <div>
                <Link href="/">
                    <button className="bg-[#fc5c3e] text-white text-lg  rounded-lg py-2 px-3 my-16" >Back to Home</button>
                </Link>
            </div>
        </div>
    );
}