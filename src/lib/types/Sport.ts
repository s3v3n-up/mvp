import { ObjectId } from "mongodb";


/**
 * @description interface for the type of sports
 * @id This is automatically added by mongodb
 * @name This is the sport name
 * @gameModes This is the type of modes in each sport
 * @requiredPlayers This the minimum number of players for each game mode
 */

export interface Sport {
	id?: string | ObjectId;
    name: string;
    gameModes: [{
		modeNames: string,
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