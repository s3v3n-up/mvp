import {models, model, Model, Schema} from 'mongoose';
import type { Match } from '@/lib/types/Match';

const matchSchema = new Schema<Match>({
    host: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    isQuick: {
        type: Boolean,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    matchTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    players: {
        type: Array<String>,
        required: false
    },
    playerLimit: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
		required: false
    }
})

/**
 * @description
 * The model for the Match collection.
 */
const MatchModel = models["match"] as Model<Match> || model<Match>('match', matchSchema);
export default MatchModel;