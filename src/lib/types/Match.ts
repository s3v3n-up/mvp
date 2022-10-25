import { ObjectId } from "mongodb";

/**
 * Interface for creating a match
 */
export interface Match {
	// This is automatically added by mongodb
	id?: string | ObjectId;
	// This is the user who created the match
	matchHost: string;
	// This is the type of sport
	sport: string;
	// This is the chosen game mode for the chosen sport
	gameMode: string;
	// This is the type of the match either REGULAR or QUICK
	matchType: Matches.Type;
	// This is the location where the match is or will happen
	location: object;
	// This is the start date/time of the match
	matchStart: Date;
	// This is the end date/time of the match
	matchEnd: Date;
	// This is the additional details for the match eg. discord links, whatsapp or zoom links, or any other information you would like to add.
	description: string;
	//This is details for the home team
	teamA: {
		members: string[],
		score: number,
		status: Matches.Status
	}
	//This is details for the away team
	teamB: {
		members: string[],
		score: number,
		status: Matches.Status

	}
}
// Namespace to contain the enums used by the match model
export namespace Matches {

	// Matches type enum
	export enum Type {
		Regular = "REGULAR",
		Quick = "QUICK",
	}
	// Matches status enum
	export enum Status {
		Win = "WIN",
		Lose = "LOSE",
		Draw = "DRAW",
		Unfinished = "UNFINISHED"
	}

}