import QuickMatch from "@/components/QuickMatch";
import { getAllSports } from "@/lib/actions/sport";

/*
*this is quick match page
*/
export default function CreateMatchPage({ data }: any) {
    return (
        <div className="flex pt-20 h-full w-full justify-center">
            <QuickMatch props={data} />
        </div>
    );
}

// Access every sport detail and pass as props
export async function getServerSideProps() {

    const data = await getAllSports();

    return {
        props: {
            data: JSON.parse(JSON.stringify(data))
        }
    };
}