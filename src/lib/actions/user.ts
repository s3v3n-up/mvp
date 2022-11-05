// Imports UserProfile interface
import { UserProfile } from "@/lib/types/User";

// Imports UserModel Schema
import UserModel from "../resources/models/User";

// Import Database from  '@/lib/resources/database'
import Database from "@/lib/resources/database";

// Import MatchModel Schema
import MatchModel from "../resources/models/Match";

/**
 * @description a function that creates user and save to the database
 * @param user accepts a user object
 * @returns a code and a message if successful user creation or user already taken
 */
export async function createUser(user: UserProfile) {
    try {

        // Sets up the database
        await Database.setup();

        // Creates a UserModel
        const player = new UserModel(user);

        // Saves the UserModel in the database
        await player.save();

        return player;

    // Catch any errors and throws a message
    } catch (error: any) {
        if (error.code === 11000 ) {
            if (error.keyPattern.userName) {
                throw new Error("Username already taken", { cause: error });
            } else {
                throw new Error("Email already taken", { cause: error });
            }
        }
        throw new Error(error.message);
    }
}

/**
 * @description A function that gets all users in the database and returns it
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
 * @getUserByEmail This is a function to check if the user exists on the database
 * @param {string} email the email of the user
 * @returns the user if it exist
 */
export async function getUserByEmail(email: string) {
    try {

        // Sets up Database connection
        await Database.setup();

        // Stores and looks for a specific user by email
        const user = await UserModel.findOne({ email });

        // Checks if user exist
        if (!user) {
            throw new Error("email not exist");
        }

        // Returns the user
        return user;

        // Catches and throws error
    } catch(error: any) {
        if (error.message) {
            throw error;
        }
        throw new Error("Error something wrong", error);
    }
}

/**
 * get user by username
 * @param {string} username the username of the user
 * @returns the user if it exist
 */
export async function getUserByUserName(userName: string) {
    try {

        // Sets up Database connection
        await Database.setup();

        // Stores and looks for a specific user by username
        const user = await UserModel.findOne({ userName });

        // Checks if user exist
        if (!user) {
            throw new Error("username not exist");
        }

        // Returns the user
        return user;

        // Catches and throws error
    } catch(error: any) {
        if (error.message) {
            throw error;
        }
        throw new Error("Error getting user", error);
    }
}

/**
 * get a list of users by username
 * @param {string[]} usernames of user we need to get
 * @returns the list users document
 */
export async function getUsersByUserName(userNames: string[]) {
    try {

        // Sets up Database connection
        await Database.setup();

        // Stores and looks for a specific user by username
        const users = await UserModel.find({ userName: { $in: userNames } });

        // Checks if user exist
        if (!users) {
            throw new Error("username not exist");
        }

        // Returns the user
        return users;

        // Catches and throws error
    } catch(error: any) {
        if (error.message) {
            throw error;
        }
        throw new Error("Error getting user", error);
    }
}

/**
 * @description This function looks for a specific user by his username
 * @param {string} username the username of the user\
 * @returns The user
 */
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

/**
 * @description This function will calculate the win/lose/draw of a specific user v1
 * @param {string} username the username of the user
 * @returns The stats(win/lose/draw) of a user
 */
export async function calculateStats(userName: string) {
    try {

        // Sets up database connection
        await Database.setup();

        // Stores and look for a specific user in the database
        const userFound = await UserModel.findOne({ userName });

        // Stores and look for all matches of the user
        const userMatches = await MatchModel.find({ matches: userFound?.matches });

        // Created a stats object to store win/lose/draw of the user
        let stats = {
            win: 0,
            lose: 0,
            draw: 0
        };

        // Checks all the matches of the user when he is on team A
        userMatches.map((e) => {
            if (e.teams[0].members.includes(userName)) {

                // win Increments by 1 if they Win
                if (e.teams[0].status === "WIN") {
                    stats.win++;

                // lose Increments by 1 if they Lose
                } else if (e.teams[0].status === "LOSE") {
                    stats.lose++;

                // draw Increments by 1 if they Draw
                } else if (e.teams[0].status === "DRAW") {
                    stats.draw++;
                }

            // Checks all the matches of the user when he is on team B
            } else if (e.teams[1].members.includes(userName)) {

                // win Increments by 1 if they Win
                if (e.teams[1].status === "WIN") {
                    stats.win++;

                // lose Increments by 1 if they Lose
                } else if (e.teams[1].status === "LOSE") {
                    stats.lose++;

                // draw Increments by 1 if they Draw
                } else if (e.teams[1].status === "DRAW") {
                    stats.draw++;
                }
            }
        });

        // Returns the stats (win/lose/draw) of the user
        return stats;

    // Catches and throws error
    } catch (error: any) {
        throw new Error("Error Cannot Calculate win/lose/draw", error);
    }
}

/**
 * calculate the win/lose/draw of a specific user v2
 * @param {string} username the username of the user
 * @return {{win: number, lose: number, draw: number}} stats win/lose/draw of a user
 */
export async function calculateStatsAggregate(userName: string): Promise<{win: number, lose: number, draw: number}> {
    try {
        await Database.setup();

        //query stats of user from database
        const query = await MatchModel.aggregate([
            { $unwind: "$teams" },
            { $match: { "teams.members": userName } },
            {
                $group: {
                    _id: "$teams.status",
                    count: { $sum: 1 }
                }
            },
        ], { allowDiskUse: true });

        //Created a stats object to store win/lose/draw of the user
        const stats = {
            win: 0,
            lose: 0,
            draw: 0
        };

        //loop through query result and add to stats object
        query.forEach((result) => {
            if (result._id === "WIN") {
                stats.win = result.count;
            } else if (result._id === "LOSE") {
                stats.lose = result.count;
            } else if (result._id === "DRAW") {
                stats.draw = result.count;
            }
        });

        return stats;
    } catch (error: any) {
        throw new Error("Error Cannot Calculate win/lose/draw", error);
    }
}