import {model, models, Model, Schema} from 'mongoose';
import type { User } from '@/lib/types/User';

const userSchema = new Schema<User>({
    nickname: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    recentMatches: {
        type: [String],
        default: [],
        required: true
    }
})

const UserModel = models["user"] as Model<User> || model<User>('user', userSchema);