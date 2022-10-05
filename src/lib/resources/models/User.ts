import {model, models, Model, Schema} from 'mongoose';
import type { User } from '@/lib/types/User';

const userSchema = new Schema<User>({
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
	lastName: {
        type: String,
        required: true
    },
	email: {
        type: String,
        required: true
    },
	contact: {
        type: String,
        required: true
    },
	records: {
        type: [{
            matchID: String,
            isWinner: Boolean,
			required: false
        }],
        default: [],
    }
})

/**
 * @description
 * The model for the User collection.
 */
const UserModel = models["user"] as Model<User> || model<User>('user', userSchema);
export default UserModel;