import {models, model, Model, Schema} from 'mongoose';
import type { Match } from '@/lib/types/match';

const matchSchema = new Schema<Match>({
    sport: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    teams: {
        type: [String],
        required: true
    },
    teamsLimit: {
        type: Number,
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    score: {
        type: [{
            team: String,
            score: Number
        }],
        default: [],
        required: true
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    }
})

const MatchModel = models["match"] as Model<Match> || model<Match>('match', matchSchema);
export default MatchModel;