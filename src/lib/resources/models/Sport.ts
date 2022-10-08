import {model, models, Model, Schema} from 'mongoose';
import type { Sport } from '@/lib/types/Sport';

/**
 * @description = This is the sport schema
 * The full description of each property is referenced in the Sport interface 
 */

const sportSchema = new Schema<Sport>({
    name: {
        type: String,
        required: true
    },
    gameModes: [{
		name: String,
		minPlayers: Number,
		maxPlayers: Number
	}]
})

/**
 * @description
 * The model for the Sport collection.
 */
const SportModel = models["sport"] as Model<Sport> || model<Sport>('sport', sportSchema);
export default SportModel;