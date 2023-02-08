import { Response } from 'express'

export const validateoperation = (
	{ token, user, ...body }: any,
	allowedUpdates: string[]
) => {
	const updates = Object.keys(body)
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	return isValidOperation
}

export const checkValidIdLength = (id: string): boolean => {
	return id.length === 24
}

export const successResponse = (res: Response, value?: any, status = 200) => {
	if (value) {
		res.status(status).send({ data: value })
	}
	res.status(status).send()
}

export const errorResponse = (res: Response, value?: any, status = 400) => {
	res.status(status).send(value)
}
