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

    // Stores and get all sports in thw database
    const data = await getAllSports();

    // Returns the sports as props
    return {
        props: {
            data: JSON.parse(JSON.stringify(data))
        }
    };
}