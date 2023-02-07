import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Task } from './task'

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
	generateAuthToken(): Promise<string>
	findByCredentials(email: string, password: string): Promise<string>
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

userSchema.methods.generateAuthToken = async function (): Promise<string> {
	const user = this
	const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

	user.tokens = user.tokens.concat({ token })
	await user.save()
	return token
}

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

//Delete user task when user id Deleted
// userSchema.pre('remove', async function (next) {
// 	const user = this
// 	await Task.deleteMany({ owner: user._id })
// 	next()
// })

export const User = mongoose.model<UserDocuments>('User', userSchema)
