import { models, model, Model, Schema } from "mongoose";
import { Match } from "@/lib/types/Match";

/**
 * subdocument schema for teams
 */
const TeamSchema = new Schema({

    //team's members
    members: {
        type: [String],
        required: true,
        default: []
    },

    //team's score
    score: {
        type: Number,
        required: true,
        default: 0
    },

    //match status of the team
    status: {
        type: String,
        required: true,
        default: "UNSET",
        enum: ["WIN", "LOSE", "DRAW", "UNSET"]
    }
});

/**
 * @description This is the match schema
 * The full description of each property is referenced in the Match interface
 */
const matchSchema = new Schema<Match>({

    // The user who created the match
    matchHost: {
        type: String,
        required: true
    },

    // The the type of sport for the created match
    sport: {
        type: String,
        required: true,
    },

    // This is the chosen game mode for the chosen sport
    gameMode: {
        modeName: {
            type: String,
            required: true,
            default: "1V1"
        },
        requiredPlayers: {
            type: Number,
            required: true,
            default: 2
        }
    },

    // This is the type of the match either REGULAR or QUICK
    matchType: {
        type: String,
        enum: ["REGULAR", "QUICK"],
        required: true
    },

    // This is the location where the match is or will happen
    location: {
        lng: {
            type: Number,
            required: true,
            default: 0
        },
        lat: {
            type: Number,
            required: true,
            default: 0
        },
        address: {
            fullAddress: {
                type: String,
                required: true
            },
            pointOfInterest: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            }
        }
    },

    // This is the start date/time of the match
    matchStart: {
        type: Date,
        default: null
    },

    // This is the end date/time of the match
    matchEnd: {
        type: Date,
        default: null
    },

    // This is the pause time
    matchPause: {
        type: Date,
        default: null
    },

    // This is the delta between the match pause and match resume
    matchPauseDelta: {
        type: Number,
        default: 0
    },

    // This is the match details, also a place where you can input extra details eg. Discord link, Facebook messenger link etc.
    description: {
        type: String
    },

    // These are the details or records for the home team, such as members, score and match result.
    teams: {
        type: [TeamSchema],
        required: true,
        default: [{
            members: [],
            score: 0,
            status: "UNSET"
        }, {
            members: [],
            score: 0,
            status: "UNSET"
        }]
    },

    // This is the status of the match
    status: {
        type: String,
        enum: ["UPCOMING", "INPROGRESS", "FINISHED", "CANCELLED", "PAUSED", "RESUMED"],
        required: true,
        default: "UPCOMING"
    },

    //This is the match queue start
    matchQueueStart: {
        type: Date,
        default: null,
    }

});

/**
 * @description
 * The model for the Match collection.
 */
const MatchModel = models["match"] as Model<Match> || model<Match>("match", matchSchema);
export default MatchModel;
