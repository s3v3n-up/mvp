import ViewUserProfile from "@/components/ViewUserProfile";

//fake data for testing view user profile page
const fakeProfileData = {
    fullName: "Shotaro Hidari",
    userName: "Shotaro Hidari",
    phone: "1234567890",
};

/*
*this is view other user's profile page
*/
export default function ViewProfile() {
    return (
        <div>
            <ViewUserProfile data={fakeProfileData} />
        </div>
    );
}
