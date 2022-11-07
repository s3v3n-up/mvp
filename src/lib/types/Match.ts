import { ObjectId } from "mongodb";

// Namespace to contain the enums used by the match model
export namespace Matches {

	// Matches type
	export type MatchType = "REGULAR" | "QUICK";

	// Matches team status type
	export type TeamStatus = "WIN" | "LOSE" | "DRAW" | "UNSET";

	// Matches status type
	export type MatchStatus = "UPCOMING" | "INPROGRESS" | "FINISHED" | "CANCELLED" | "PAUSED";
}

/**
 * Match Team type
 * @property members - The members of the team
 * @property score - The score of the team
 * @property status - The status of the team
 */
export interface Team {
	members: string[];
	score: number;
	status: Matches.TeamStatus;
}

/**
 * Interface for creating a match
 */
export interface Match {

	// This is automatically added by mongodb
	_id?: string | ObjectId;

	// This is the user who created the match
	matchHost: string;

	// This is the type of sport
	sport: string;

	// This is the chosen game mode for the chosen sport
	gameMode: { modeName: string, requiredPlayers: number };

	// This is the type of the match either REGULAR or QUICK
	matchType: Matches.MatchType;

	// This is the location where the match is or will happen
	location: object;

	// This is the start date/time of the match
	matchStart: Date | null;

	// This is the end date/time of the match
	matchEnd: Date | null;

	// This is the additional details for the match eg. discord links, whatsapp or zoom links, or any other information you would like to add.
	description: string;

	//this is the teams that are playing in the match
	teams: [Team, Team];

	//This is the status of the match
	status: Matches.MatchStatus;

	//This is the match queue start
	matchQueueStart: Date | null;

	//This is the match pause time;
	matchPauseTime: Date | null;
}

