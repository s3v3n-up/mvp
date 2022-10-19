import data from './data.json';

import Sport from '@/lib/resources/models/Sport';

export default async function seedAll() {
    return Promise.all(
        [
            Sport.insertMany(data)
        ]
    );
};