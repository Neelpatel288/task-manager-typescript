import { errorResponse } from './../helper'
import { User, UserDocuments } from './../models/user'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { errorMessages } from '../errorMessages'

interface JwtPayload {
	_id: string
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token: string | undefined = req
			.header('Authorization')
			?.replace('Bearer ', '')

		if (!token) {
			throw new Error(errorMessages.pleaseAuth)
		}
		const secretKey: string = process.env.SECRET_KEY || ''

		const decoded = jwt.verify(token, secretKey) as JwtPayload
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		})

		if (!user) {
			throw new Error(errorMessages.pleaseAuth)
		}

		req.body.token = token
		req.body.user = user
		next()
	} catch (e: any) {
		console.log(e)
		const { message } = e
		errorResponse(res, { message })
	}
}

export const generateAuthToken = async function (
	query: UserDocuments
): Promise<string> {
	const secretKey: string = process.env.SECRET_KEY || ''
	const user = query
	const token = jwt.sign({ _id: user._id.toString() }, secretKey)

	user.tokens = user.tokens.concat({ token })
	await user.save()
	return token
}
