import { model, models, Model, Schema } from 'mongoose';
import type { User } from '@/lib/types/User';
import { PHONE_REGEX, EMAIL_REGEX } from '@/lib/resources/constants'

/**
 * @description = This is the user schema
 * The full description of each property is referenced in the User interface 
 */

const userSchema = new Schema<User>({
	userName: {
		type: String,
		min: [8, 'Username should be at least 8 characters'],
		max: [30, 'Username should be max of 30 characters'],
		required: [true, 'Username is required'],
		unique: true
	},
	firstName: {
		type: String,
		min: [8, 'Firstname should be at least 8 characters'],
		max: [64, 'Firstname should be max of 64 characters'],
		required: [true, 'Firstname is required'],
	},
	lastName: {
		type: String,
		min: [8, 'Lastname should be at least 8 characters'],
		max: [64, 'Lastname should be max of 64 characters'],
		required: [true, 'Lastname is required'],
	},
	email: {
		type: String,
		validate: {
			validator: function (v: string) {
				return EMAIL_REGEX.test(v);
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		required: [true, 'User phone number required'],
		unique: true
	},
	phonenumber: {
		type: String,
		validate: {
			validator: function (v: string) {
				return PHONE_REGEX.test(v);
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		required: [true, 'User phone number required']
	},
	matches: [{
		type: Schema.Types.ObjectId,
		ref: 'match',
		required: true,
		default: []
	}]
})

/**
 * @description
 * The model for the User collection.
 */
const UserModel = models["user"] as Model<User> || model<User>('user', userSchema);
export default UserModel;