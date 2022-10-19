import { UserProfile } from "@/lib/types/User";
// import Database from  '@/lib/resources/database'
import UserModel from "../resources/models/User";

import Database from "@/lib/resources/database";
import MatchModel from "../resources/models/Match";

/**
 * @description = a function that creates user and save to the database
 * @param user = accepts a user object
 * @returns = returns a code and a message if successful user creation or user already taken
 */
export async function createUser(user: UserProfile) {
    await Database.setup();

    // Deconstruct username
    const { userName, email } = user;

    // Check if the username already exist in the database
    const existingUser = await UserModel.findOne({ userName });
    const existingEmail = await UserModel.findOne({ email });

    // If username exist returns an error code and message
    if (existingUser || existingEmail) {
        return {
            code: 400,
            message: "Username or email already taken"
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
}

export async function updateUser(username: string, firstName: string, lastName: string, phonenumber: string, image: string) {

    //  const { userName } = user;

    const foundUser = await UserModel.findOneAndUpdate({ username }, {
        firstName,
        lastName,
        phonenumber,
        image
    }, {
        new: true
    });

    // Saves the UserModel in the database
    return foundUser;

}

/**
 * @description = A function that gets all users in the database and returns it
 */
export async function getUsers() {
    await Database.setup();

    const users = await UserModel.find({});

    return users;
}

/**
 * @userExist This is a function to check if the user exists on the database
 */

export async function userExist(email: string) {
    await Database.setup();

    const user = await UserModel.findOne({ email });

    return user;
}

export async function findUserByUsername(userName: string): Promise<UserProfile[]> {
    try {

        //find all users with matching username pattern
        const users = await UserModel.find({ userName: { $regex: userName } });

        //return users
        return users;
    } catch (error: any) {
        throw new Error("error searching user", { cause: error });
    }
}

export async function insertMatch(userName: string, matchid: string) {

    //  const { userName } = user;
    // const matchFound = await MatchModel.findOne({ _id: matchid });

    const updateUserMatch = await UserModel.updateOne({ userName },
        {
            $push: { matches: matchid }

        }, {
            new: true
        });

    // Saves the UserModel in the database
    return updateUserMatch;
}

export async function calculateWin(userName: string) {
    try {
        await Database.setup();

        const userFound = await UserModel.findOne({ userName });

        // const userMatches = await MatchModel.find({ matches: userFound?.matches });


        // let stats = {
        //     totalWin: 0,
        //     totalLose: 0,
        //     draw: 0

        // };

        // userMatches.map((e) => {
        //     if (e.teamA.members.includes(userName)) {
        //         if (e.teamA.status === "WIN") {
        //             stats.totalWin++;
        //         } else if (e.teamA.status === "LOSE") {
        //             stats.totalLose++;
        //         } else if (e.teamA.status === "DRAW") {
        //             stats.draw++;
        //         }
        //     } else if (e.teamB.members.includes(userName)) {
        //         if (e.teamB.status === "WIN") {
        //             stats.totalWin++;
        //         } else if (e.teamB.status === "LOSE") {
        //             stats.totalLose++;
        //         } else if (e.teamB.status === "DRAW") {
        //             stats.draw++;
        //         }
        //     }
        // });

        //let win = await MatchModel.find({ matches: userFound?.matches, }).countDocuments( { teamA: {status: "WIN", members: userName}, teamB: {status: "WIN", members: userName}});
        // let loseA = MatchModel.find({ matches: userFound?.matches, "teamB.status": "LOSE", "teamB.members": userName }).count();
        // let loseB = MatchModel.find({ matches: userFound?.matches, "teamA.status": "LOSE", "teamA.members": userName }).count();

        let winA = await MatchModel.aggregate([
            {
                $match: {
                    matches: userFound?.matches
                }
            },
            {
                $count: {}
            }
        ])


        
        console.log(winA)
        // return stats;
        return {
            winA
        };

    } catch (error: any) {
        throw new Error("Error Cannot Calculate win/lose/draw", error);
    }
}