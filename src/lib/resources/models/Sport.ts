import {model, models, Model, Schema} from 'mongoose';
import type { Sport } from '@/lib/types/Sport';

/**
 * @description = This is the sport schema
 * The full description of each property is referenced in the Sport interface 
 */

const sportSchema = new Schema<Sport>({
	// This is the name of the sport
    name: {
        type: String,
        required: true
    },
	// These are the details for the game modes for each sport such as "1v1", "2v2", etc., also contains the minimum players required and maximum players required for each game mode under a specific sport
    gameModes: [{
		modeName: String,
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