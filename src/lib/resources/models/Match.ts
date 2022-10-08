import {models, model, Model, Schema} from 'mongoose';
// import type { Match.Type } from '@/lib/types/Match';
import { Match, Matches } from '@/lib/types/Match'
import {ObjectId} from 'mongodb'
import UserModel  from '@/lib/resources/models/User'

/**
 * @description = This is the match schema
 * The full description of each property is referenced in the Match interface 
 */

const matchSchema = new Schema<Match>({
    matchHost: {
        type: String || ObjectId || UserModel,
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
		enum: Matches.Type,
        required: true
    },
    location: {
        type: String,
        required: true,
		default: {}
    },
    matchStart: {
        type: Date,
		min: [Date.now(), "Date should not be less than current date/time"],
        required: true,
		default: Date.now()
    },
	matchEnd: {
        type: Date,
        min: [Date.now(), "Date should not be less than current date/time"],
        required: true,
		default: Date.now()
    },
    description: {
        type: String,
        required: true
    },
    players: {
        type: [String],
        required: true,
		default: []
    },
	teamA: {
		members: [{
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
			default: []
		}],
		score: Number,
		required: true,
		result: {
			type: String,
			enum: Matches.Result,
			required: true,
			default: ''
		},
		default: {}
	},
	teamB: {
		members: [{
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
			default: []
		}],
		score: Number,
		required: true,
		result: {
			type: String,
			enum: Matches.Result,
			required: true,
			default: ''
		},
		default: {}
	}
})

/**
 * @description
 * The model for the Match collection.
 */
const MatchModel = models["match"] as Model<Match> || model<Match>('match', matchSchema);
export default MatchModel;