import { ObjectId } from 'mongodb'

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
	matchHost: string ;
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

	export enum Type {
		Regular = "REGULAR",
		Quick = "QUICK",
	}

	export enum Status {
		Win = "WIN",
		Lose = "LOSE",
		Draw = "DRAW",
		Unfinished = "UNFINISHED"
	}

}