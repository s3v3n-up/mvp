import { UserProfile } from "@/lib/types/User";
// import Database from  '@/lib/resources/database'
import UserModel from "../resources/models/User";

import Database from "@/lib/resources/database";

/**
 * @description = a function that creates user and save to the database
 * @param user = accepts a user object
 * @returns = returns a code and a message if successful user creation or user already taken
 */
 export async function createUser(user: UserProfile) {
    try {
        // Deconstruct username
        const { userName } = user;

        // Check if the username already exist in the database
        const existingUser = await UserModel.findOne({ userName });

        // If username exist returns an error code and message
        if(existingUser) {
            return {
                code: 400,
                message: "Username already taken"
            };
        }

        // Creates a UserModel
        const player = new UserModel<UserProfile>(user);

        // Saves the UserModel in the database
        await player.save();

        // Returns a code and message for successful creation of user
        return {
            code: 200,
            message: "User successfully created"
        };

    } catch(error: any) {
        throw new Error("Error creating a user", error.message);
    }

}

/**
 * @description = A function that gets all users in the database and returns it
 */
export async function getUsers() {
    await Database.setup();

    const users = await UserModel.find({});

    return users;
}