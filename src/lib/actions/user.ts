import { UserProfile } from "@/lib/types/User";
// import Database from  '@/lib/resources/database'
import UserModel from "../resources/models/User";

import Database from "@/lib/resources/database";

/**
 * @description a function that creates user and save to the database
 * @param user accepts a user object
 * @returns = returns a code and a message if successful user creation or user already taken
 */
export async function createUser(user: UserProfile) {
    try {
        // Deconstruct user to get username and email
        const { userName, email } = user;

        // Check if the username already exist in the database
        const existingUser = await UserModel.findOne({ userName });
        // Check if the email already exist in the database
        const existingEmail = await UserModel.findOne({ email });

        // If username exist returns an error code and message
        if(existingUser || existingEmail) {
            return {
                code: 400,
                message: "Username or Email already taken"
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
      // Catch any errors and throws a message
    } catch(error: any) {
        throw new Error("Error creating a user", error.message);
    }

}

/**
 * @description = A function that gets all users in the database and returns it
 */
export async function getUsers() {
    try {
        // Sets up the database
        await Database.setup();

        // Stores all the users in the database
        const users = await UserModel.find({});

        // Returns all users
        return users;

      // Catches any error and throws it in message
    } catch(error: any) {
        throw new Error("Error getting users", error.message);
    }
}