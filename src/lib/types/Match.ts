export interface Match {
    _id?: string;
    sport: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string; 
    teams: string[];
    teamsLimit: number;
    languages: string[];
    score: Score[];
    status: boolean;
}

export interface Score {
    team: string;
    score: number;
}