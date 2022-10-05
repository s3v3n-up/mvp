export interface Match {
    _id?: string;
	host: string;
	sport: Sport;
	isQuick: boolean;
	location: string;
	matchTime: string;
	description: string;
	players?: string[];
	playerLimit: number;
	duration?: number;
}

export enum Sport {
	basketball = "BASKETBALL",
	tennis = "TENNIS",
	pingpong = "PINGPONG",
	volleyball = "VOLLEYBALL",
	badminton = "BADMINTON",
}