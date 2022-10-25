import { models, model, Model, Schema } from "mongoose";
import { Match, Matches } from "@/lib/types/Match";

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
        type: String,
        required: true,
    },

    // This is the type of the match either REGULAR or QUICK
    matchType: {
        type: String,
        enum: Matches.Type,
        required: true
    },

    // This is the location where the match is or will happen
    location: {
        type: Object,
        required: true,
        default: {}
    },

    // This is the start date/time of the match
    matchStart: {
        type: Date,
        required: true,
        default: Date.now()
    },

    // This is the end date/time of the match
    matchEnd: {
        type: Date,
        required: true,
        default: Date.now()
    },

    // This is the match details, also a place where you can input extra details eg. Discord link, Facebook messenger link etc.
    description: {
        type: String,
        required: true,
    },

    // These are the details or records for the home team, such as members, score and match result.
    teamA: {
        members: [{
            type: String,
            required: true,
            default: []
        }],
        score: Number,
        status: {
            type: String,
            enum: Matches.Status,
            required: true,
            default: ""
        },
        default: {}
    },

    // These are the details or records for the away team, such as members, score and match result.
    teamB: {
        members: [{
            type: String,
            required: true,
            default: []
        }],
        score: Number,
        status: {
            type: String,
            enum: Matches.Status,
            required: true,
            default: ""
        },
        default: {}
    }
});

/**
 * @description
 * The model for the Match collection.
 */
const MatchModel = models["match"] as Model<Match> || model<Match>("match", matchSchema);
export default MatchModel;
