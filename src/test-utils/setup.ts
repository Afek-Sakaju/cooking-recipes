import { connectDB } from '../DB/mongoose';
import {
    JEST_TIMEOUT,
    MONGO_URL,
    USE_MONGO_MEMORY,
} from './envirnoment-test-variables';

if (JEST_TIMEOUT) jest.setTimeout(JEST_TIMEOUT);

let mongo: any;

beforeAll(async () => {
    if (USE_MONGO_MEMORY) {
        await import('mongodb-memory-server').then(
            async ({ MongoMemoryServer }) => {
                mongo = await MongoMemoryServer.create();
                const uri = mongo.getUri();
                await connectDB(uri);
            }
        );
    } else {
        const uri = MONGO_URL;
        await connectDB(uri);
    }
});

afterAll(async () => {
    mongo?.stop();
});
