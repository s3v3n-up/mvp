import { ObjectId } from "mongodb";

// Namespace to contain the enums used by the match model
export namespace Matches {

  /**
   * this is the match type
   */
  export type MatchType = "REGULAR" | "QUICK";

  /**
   * this is the match result
   */
  export type TeamStatus = "WIN" | "LOSE" | "DRAW" | "UNSET";

  // Matches status type
  export type MatchStatus =
    | "UPCOMING"
    | "INPROGRESS"
    | "FINISHED"
    | "CANCELLED"
    | "PAUSED";

  // Match status enum
  export enum Status {
    UPCOMING = "UPCOMING",
    INPROGRESS = "INPROGRESS",
    FINISHED = "FINISHED",
    CANCELLED = "CANCELLED",
    PAUSED = "PAUSED",
  }
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

  /**
   * This is automatically added by mongodb
   */
  _id?: string | ObjectId;

  /**
   * This is the user who created the match
   */
  matchHost: string;

  /**
   * this is the type of sport
   */
  sport: string;

  /**
   * this is the game mode which contains modeName like 1vs1 and players number required.
   */
  gameMode: {
    modeName: string;
    requiredPlayers: number;
  };

  /**
   * this is the match type to choose
   */
  matchType: Matches.MatchType;

  /**
   * this is the location type
   */
  location: {
    lng: number;
    lat: number;
    address: {
      fullAddress: string;
      pointOfInterest: string;
      city: string;
      country: string;
    };
  };

  /**
   * This is the start date/time of the match
   */
  matchStart: Date | null;

  /**
   * This is the end date/time of the match
   */
  matchEnd: Date | null;

  /**
   * This is the additional details for the match eg.discord/facebook link.Or additional info you would like to add.
   */
  description: String;

  /**
   * this is the two teams that are playing in the match
   */
  teams: [Team, Team];

  /**
   * This is the status of the match
   */
  status: Matches.MatchStatus;

  /**
   * This is the match queue start
   */
  matchQueueStart: Date | null;

  /**
   * This is the match pause time
   */
  matchPause: Date | null;

  //delta between match pause and match resume
  matchPauseDelta?: number;
}
