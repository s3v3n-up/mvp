import {model, models, Model, Schema} from 'mongoose';
import type { Sport } from '@/lib/types/Sport';

const sportSchema = new Schema<Sport>({
    name: {
        type: String,
        required: true
    },
    records: {
        type: [{
            team: String,
            wins: Number
        }],
        default: [],
        required: true
    }
})

/**
 * @description
 * The model for the Sport collection.
 */
const SportModel = models["sport"] as Model<Sport> || model<Sport>('sport', sportSchema);
export default SportModel;