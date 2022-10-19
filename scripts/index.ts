import data from './data.json';

import Sport from '@/lib/resources/models/Sport';

import Database from '@/lib/resources/database';

async function main() {
    // TODO: setup the database
    await Database.setup();

    try {
        const result = await Sport.insertMany(data);
        console.log('[SUCCESS]', result);
    } catch(error) {
        console.log('[ERROR]', error);
        console.log('exiting with failure');
        process.exit(0);
    }
}

main();
