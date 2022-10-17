import userModel from "@/lib/resources/models/User";
import type { UserProfile as User } from "@/lib/types/User";

/**
 * search for users that matches a given username
 * @param {string} userName - username of user to find
 * @returns {User[]} array of users with matching username
 */
export async function findUserByUsername(userName: string): Promise<User[]> {
   try {

        //find all users with matching username pattern
        const users = await userModel.find({userName: { $regex: userName }});

        //return users
        return users;
    } catch(error: any) {
        throw new Error("error searching user", { cause: error });
    } 
}

