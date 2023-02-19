import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

export interface UserInput {
	name: string
	email: string
	password: string
	age: number
	tokens: { token: string }[]
}

export interface UserDocuments extends UserInput, mongoose.Document {
	createdAt: Date
	updatedAt: Date
}

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true,
			validate(value: string) {
				if (!validator.isEmail(value)) {
					throw new Error('Email is invalid!')
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 7,
			validate(value: string) {
				if (value.toLowerCase().includes('password')) {
					throw new Error('Password cannot contains "password"')
				}
			},
		},
		age: {
			type: Number,
			default: 0,
			validate(value: number) {
				if (value < 0) {
					throw new Error('Age must be a positive number')
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
)

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens
	return userObject
}

//Hash the plain text password
userSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

export const User = mongoose.model<UserDocuments>('User', userSchema)
