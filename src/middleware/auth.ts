import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { errorMessages } from '../errorMessages'
import { User } from '../models/user'

interface JwtPayload {
	_id: string
	// other properties...
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token: string | undefined = req
			.header('Authorization')
			?.replace('Bearer ', '')

		if (!token) {
			throw new Error(errorMessages.pleaseAuth)
		}

		const decoded = jwt.verify(token, 'thisismynewcourse') as JwtPayload
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
		res.status(401).send({ message, status: 401 })
	}
}
