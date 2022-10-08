import { ObjectId } from 'mongodb'
import { User } from '@/lib/types/User'

/**
 * Interface for creating a match
 * @id = This is automatically added by mongodb
 * @matchHost = this is the user who created the match
 * @sport = This is the type of sport
 * @matchType = This is the type of the match either REGULAR or QUICK
 * @matchEnd = This is the end date/time of the match
 * @description = This is the match details 
 * @players =  These are the users who joined the match
 * @teamA = This is the home team 
 * @teamB = This is the away team
 */

export interface Match {
	id?: string | ObjectId;
	matchHost: string | ObjectId | User;
	sport: string;
	matchType: Matches.Type;
	location: object;
	matchStart: Date;
	matchEnd: Date;
	description: string;
	players: object[] | User[];
	teamA: {
		members: string[],
		score: number,
		result: Matches.Result
	}
	teamB: {
		members: string[],
		score: number,
		result: Matches.Result

	}
}

export namespace Matches {

	export enum Type {
		Regular = "REGULAR",
		Quick = "QUICK",
	}

	export enum Result {
		Win = "WIN",
		Lose = "LOSE",
		Draw = "DRAW"
	}

}

// export enum Sport {
// 	Basketball = "BASKETBALL",
// 	Tennis = "TENNIS",
// 	Pingpong = "PINGPONG",
// 	Volleyball = "VOLLEYBALL",
// 	Badminton = "BADMINTON",
// }

// export enum MatchSubType {
// 	Onevsone = "1V1",
// 	Twovstwo = "2V2",
// 	Threevsthree = "3V3",
// 	Fourvsfour = "4V4",
// 	Fivevsfive = "5V5",
// 	Sixbysix = "6V6",
// }

