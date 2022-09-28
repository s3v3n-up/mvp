import {model, models, Model, Schema} from 'mongoose';
import type { Team } from '@/lib/types/Team';

const teamSchema = new Schema<Team>({
    name: {
        type: String,
        required: true
    },
    leader: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        default: [],
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

/**
 * @description
 * The model for the Team collection.
 */
const TeamModel = models["team"] as Model<Team> || model<Team>('team', teamSchema);
export default TeamModel;