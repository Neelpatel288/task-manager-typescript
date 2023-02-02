export const validateoperation = (body: any, allowedUpdates: string[]) => {
	const updates = Object.keys(body)
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	return isValidOperation
}

export const checkValidIdLength = (id: string) => {
	return id.length === 24
}
