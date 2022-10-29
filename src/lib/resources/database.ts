import mongoose from "mongoose";
import { MongoClient } from "mongodb";

/**
 * @description
 * entity that manage database client connections
 */
export default class Database {
    static mongooseClient: typeof mongoose;
    static mongoClientPromise: Promise<MongoClient>;
    static mongoUri: string = process.env.MONGODB_URI??"mongodb://localhost:27017/mvplab";

    /**
     * set up single database connection
     * @param uri - database uri
     * @returns mongoose client connection
     * @throws {Error} - error setting up mongoose connection
     */
    static async setup(uri: string = this.mongoUri) {
        try {
            if (!this.mongooseClient) {
                this.mongooseClient = await mongoose.connect(uri);
            }

            return this.mongooseClient;
        } catch (error) {
            throw new Error("error setting up mongoose connection", { cause: error });
        }
    }

    /**
    * set up single monogodb-adapter connection for next-auth
    * @param {string} uri - database uri
    * @returns {Promise<MongoClient>} - mongodb client connection promise
    * @throws {Error} - error setting up mongodb connection
    */
    static async setupAdapterConnection(uri: string= this.mongoUri): Promise<MongoClient> {
        try {
            if (!this.mongoClientPromise) {
                this.mongoClientPromise = MongoClient.connect(uri);
            }

            return this.mongoClientPromise;
        } catch (error) {
            throw new Error("error setting up mongodb-adapter connection", { cause: error });
        }
    }
}


