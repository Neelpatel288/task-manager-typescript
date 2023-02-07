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
