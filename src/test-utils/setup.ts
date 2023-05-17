import { MongoMemoryServer } from 'mongodb-memory-server';
import { database, config, up } from 'migrate-mongo';

import { connectDB } from '../DB/mongoose';
import { JEST_TIMEOUT } from './environment-test-variables';
import { MIGRATIONS_DIR_PATH } from '../utils/paths';

if (JEST_TIMEOUT) jest.setTimeout(JEST_TIMEOUT);

let mongo: any;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await connectDB(uri);

    await config.set({
        mongodb: {
            url: uri,
            // @ts-ignore
            options: { useNewUrlParser: true },
        },
        migrationsDir: MIGRATIONS_DIR_PATH,
        changelogCollectionName: 'changelog',
        migrationFileExtension: '.js',
    });

    const { db, client } = await database.connect();
    await up(db, client);
});

afterAll(async () => {
    mongo?.stop();
});
