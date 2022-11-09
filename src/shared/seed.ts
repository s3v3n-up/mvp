// Imports data from Data.json
import data from "@/lib/resources/data/data.json";

// Imports Sports Schema
import Sport from "@/lib/resources/models/Sport";

// Function that creates many sports model in the database
export default async function seedAll() {
    return Promise.all(
        [

            // Creates many sports model in the database
            Sport.insertMany(data)
        ]
    );
};