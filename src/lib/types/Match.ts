/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongodb';

/**
 * Interface for creating a match
 * @id This is automatically added by mongodb
 * @matchHost this is the user who created the match
 * @sport This is the type of sport
 * @matchType This is the type of the match either REGULAR or QUICK
 * @location This is the location where the match is or will happen
 * @matchStart This is the start date/time of the match
 * @matchEnd This is the end date/time of the match
 * @description This is the match details 
 * @teamA This is the home team 
 * @teamB This is the away team
 */
export interface Match {
	id?: string | ObjectId;
	matchHost: string | ObjectId;
	sport: string;
	matchType: Matches.Type;
	location: object;
	matchStart: Date;
	matchEnd: Date;
	description: string;
	teamA: {
		members: string[],
		score: number,
		status: Matches.Status
	}
	teamB: {
		members: string[],
		score: number,
		status: Matches.Status
	}
}

export namespace Matches {

	/**
	 * @enum {string} match type
	 * @property {string} Regular - Regular match
	 * @property {string} Quick - Quick match
	 */
	export enum Type {
		Regular = "REGULAR",
		Quick = "QUICK",
	}

	/**
	 * @enum {string} match status
	 * @property {string} Win - Team won
	 * @property {string} Lose - Team lost
	 * @property {string} Draw - Team draw
	 * @property {string} Unfinished - Match is not finished
	 */
	export enum Status {
		Win = "WIN",
		Lose = "LOSE",
		Draw = "DRAW",
		Unfinished = "UNFINISHED"
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

