import { useRouter } from "next/router";

/**
 * sport button to navigate to sport leaderboard
 * @param {string} sportName - name of sport
 * @return {JSX.Element} sport component
 */
export default function Sport({ sportName }: {sportName: string}) {
    const router = useRouter();

    /**
     * navigate to specific sport leaderboard
     */
    function onRedirect (){
        router.push(`/leaderboard/${sportName}`);
    }

    return (
        <button
            className={
                `bg-white text-orange-500 
                font-bold py-2 px-10 
                border-2 border-orange-500
                hover:bg-orange-600 hover:text-white
                hover:border-white rounded-3xl
                md:text-lg text-sm h-full min-w-42
                ease-out duration-200
                `
            }
            onClick={onRedirect}>
            <p className="text-center">{sportName}</p>
        </button>
    );
}