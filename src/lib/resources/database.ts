import mongoose from "mongoose";
import { MongoClient } from "mongodb";

/**
 * @description
 * entity that manage database client connections
 */
export default class Database {
    static mongooseClient: typeof mongoose;
    static mongoClientPromise: Promise<MongoClient>;

    /**
     * set up single database connection
     * @param uri - database uri
     * @returns mongoose client connection
     */
    static async setup(uri: string = process.env.MONGODB_URI!) {
        if (!this.mongooseClient) {
            this.mongooseClient = await mongoose.connect(uri);
        }

        return this.mongooseClient;
    }

    /**
    * set up single monogodb-adapter connection for next-auth
    * @param {string} uri - database uri
    * @returns {Promise<MongoClient>} - mongodb client connection promise
    */
    static async setupAdapterConnection(uri: string= process.env.MONGODB_URI!): Promise<MongoClient> {
        if (!this.mongoClientPromise) {
            this.mongoClientPromise = MongoClient.connect(uri);
        }

        return this.mongoClientPromise;
    }

}


