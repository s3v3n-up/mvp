import QuickMatch from "@/components/QuickMatch";
import { getAllSports } from "@/lib/actions/sport";
import Database from "@/lib/resources/database";
import { Sport } from "@/lib/types/Sport";


interface Props{
    data: Sport[]
}

/*
*this is quick match page
*/
export default function CreateMatchPage({ data }: Props) {
    return (
        <section className="flex pt-20 h-full w-full justify-center">
            <QuickMatch props={data} />
        </section>
    );
}

// Access every sport detail and pass as props
export async function getServerSideProps() {

    // Database connection
    await Database.setup();

    // Stores and get all sports in the database
    const data = await getAllSports();

    // Returns the data as props
    return {
        props: {
            data: JSON.parse(JSON.stringify(data))
        }
    };
}