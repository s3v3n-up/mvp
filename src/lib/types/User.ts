export interface User {
    _id?: string;
	userName: string;
    firstName: string;
    lastName: string;
	email: string;
	contact: string;
	records: Record[]  
}

export interface Record {
    isWinner: boolean;
    matchID: string;
}

