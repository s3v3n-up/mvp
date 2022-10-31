//this is view other user's profile page
import Navbar from "@/components/Navbar";
import ViewUserProfile from "@/components/ViewUserProfile";
import Data from "@/components/ViewUserProfile";

export default function ViewProfile() {
    return (
        <div>
            <Navbar />
            <ViewUserProfile data={undefined} />
        </div>
    );
}
