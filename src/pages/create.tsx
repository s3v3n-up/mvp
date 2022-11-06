import CreateMatch from "@/components/createMatch";
import { getAllSports } from "@/lib/actions/sport";

/*
*this is create match page
*/
export default function CreateMatchPage({ data }: any) {
    return (
        <div>
            <CreateMatch props={data}/>
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
