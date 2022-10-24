import { ObjectId } from "mongodb";


/**
 Interface for the type of sports
 */

export interface Sport {
	// This is automatically added by mongodb
	id?: string | ObjectId;
	// This is the sport name
    name: string;
	// This is the type of modes in each sport
    gameModes: [{
		// This is the name of the game mode
		name: string,
		// This the minimum number of players for each game mode
		requiredPlayers: number
	}];
	records: [{
		playerName: string,
		win: number,
		lose: number,
		draw: number,
		unfinished: number
	}];
}