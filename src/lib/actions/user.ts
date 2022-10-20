// Imports UserProfile interface
import { UserProfile } from "@/lib/types/User";
// Imports UserModel Schema
import UserModel from "../resources/models/User";
// import Database from  '@/lib/resources/database'
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

/**
 * @description Updates a user profile
 * @param {string} username the username to be updated
 * @param {string} firstName the first name of the user to be changed
 * @param {string} lastName the last name of the user to be changed
 * @param {string} phonenumber the phone number of the user to be changed
 * @param {string} image the image/logo of the user to be change
 * @returns the updated user
 */
export async function updateUser(userName: string, firstName: string, lastName: string, phonenumber: string, image: string) {

    try {
        // Gets the user by username
        const user = await UserModel.findOne({ userName });
        // Stores and look for a specific user id and updates it in the database
        const updatedUser = await UserModel.findOneAndUpdate({ _id: user?.id }, {
            userName,
            firstName,
            lastName,
            phonenumber,
            image
        }, {
            new: true
        });

        // returns the updated user
        return updatedUser;
        // Catches any errors and throws it
    } catch (error: any) {
        throw new Error("Error updating the user", error.message);
    }
}


/**
 * @userExist This is a function to check if the user exists on the database
 * @param {string} email the email of the user
 * @returns the user if it exist
 */
export async function userExist(email: string) {
    try {
        // Sets up Database connection
        await Database.setup();

        // Stores and looks for a specific user by email
        const user = await UserModel.findOne({ email });

        // Returns the user
        return user;
        // Catches and throws error
    } catch(error: any) {
        throw new Error("Error something wrong", error);
    }
}

export async function findUserByUsername(userName: string): Promise<UserProfile[]> {
    try {

        //find all users with matching username pattern
        const users = await UserModel.find({ userName: { $regex: userName } });

        //return users
        return users;
    // Catches and throws error
    } catch(error: any) {
        throw new Error("error searching user", { cause: error });
    }
}