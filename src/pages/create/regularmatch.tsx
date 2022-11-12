import CreateMatch from "@/components/createMatch";
import { getAllSports } from "@/lib/actions/sport";
import Database from "@/lib/resources/database";
import { Sport } from "@/lib/types/Sport";

interface Props{
    data: Sport[]
}

/*
*this is create match page
*/
export default function CreateMatchPage({ data }: Props) {
    return (
        <section>
            <CreateMatch props={data}/>
        </section>
    );
}

// Access every sport detail and pass as props
export async function getServerSideProps() {

    // Database connection
    await Database.setup();

    // Stores all Sports in data variable
    const data = await getAllSports();

    // Return all the sports as props
    return {
        props: {
            data: JSON.parse(JSON.stringify(data))
        }
    };
}
