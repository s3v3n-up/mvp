import { ObjectId } from "mongodb";


/**
 * @description interface for the type of sports
 * @id This is automatically added by mongodb
 * @name This the sport name
 * @gameModes = This is the type of modes in each sport
 * @minPlayers = Minimum players for each game mode of each sports
 * @maxPlayers = Maximum players for each game mode of each sports
 */

export interface Sport {
	id?: string | ObjectId;
    name: string;
    gameModes: [{
		modeName: string,
		minPlayers: number,
		maxPlayers: number
	}];
	records: [{
		playerName: string,
		win: number,
		lose: number,
		draw: number,
		unfinished: number
	}];
}