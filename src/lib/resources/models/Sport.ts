import {model, models, Model, Schema} from 'mongoose';
import type { Sport } from '@/lib/types/Sport';

const sportSchema = new Schema<Sport>({
    sportName: {
        type: String,
        required: true
    },
    maxPlayers: {
		type: Number,
		required: true
	}  
})

/**
 * @description
 * The model for the Sport collection.
 */
const SportModel = models["sport"] as Model<Sport> || model<Sport>('sport', sportSchema);
export default SportModel;