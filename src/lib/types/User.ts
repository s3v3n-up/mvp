import { ObjectId } from "mongodb";
import { Match } from "@/lib/types/Match";

/**
 * Interface for creating a user
 */
export interface UserProfile {

	// This is automatically added by mongodb
	_id?: string | ObjectId;

	// This the unique for every user
	userName: string;

	// This is the user's first name
	firstName: string;

	// This is the user's last name
	lastName: string;

	// This is the user's email address and is unique
	email: string;

	// This is the user's contact info
	phoneNumber: string;

	// This is the image/logo of the user
	image: string;

	// This is the matches that the user creates/joins
	matches: Match[]
}

