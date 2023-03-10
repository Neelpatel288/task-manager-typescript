import { User } from './../../models/user'
import bcrypt from 'bcryptjs'

export const createUser = async (body: any) => {
	const user = await User.create(body)
	return user
}

export const userLogin = async (email: string, password: string) => {
	const user = await User.findOne({ email })
	if (!user) {
		throw new Error('Unable to login')
	}

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) {
		throw new Error('Unable to login')
	}

	return user
}

export const updateUser = async (user: any, body: any) => {
	const updates = Object.keys(body)
	updates.forEach((update) => (user[update] = body[update]))

	return await user.save()
}

export const deleteUser = async (id: string) => {
	const user = User.deleteOne({ id })
	return user
}
