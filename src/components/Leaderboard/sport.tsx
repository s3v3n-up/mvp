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
                font-bold py-2 px-4 
                border-2 border-orange-500
                hover:bg-orange-500 hover:text-white
                hover:border-white rounded-md 
                text-2xl`
            }
            onClick={onRedirect}>
            <p className="text-center">{sportName}</p>
        </button>
    );
}