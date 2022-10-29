import data from "@/lib/resources/data/data.json";

import Sport from "@/lib/resources/models/Sport";

export default async function seedAll() {
    return Promise.all(
        [
            Sport.insertMany(data)
        ]
    );
};