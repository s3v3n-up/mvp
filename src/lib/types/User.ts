import {ObjectId} from 'mongodb'
import { Match } from '@/lib/types/Match'

/**
 * @description  interface for creating a user
 * @id This is automatically added by mongodb
 * @userName This the unique for every user
 * @firstName This is the user's first name
 * @lastName This is the user's last name
 * @email This is the user's email address and is unique
 * @phonenumber This is the user's contact info 
 * @image This is the image/logo of the user
 * @matches This is the matches that the user creates/joins
 */
export interface UserProfile {
    id?: string | ObjectId;
	userName: string;
    firstName: string;
    lastName: string;
	email: string;
	phonenumber: string;
	image: string;
	matches: Match[]
}