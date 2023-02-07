import { Task } from '../../models/task'

export const createTask = async (body: any, id: string) => {
	const task = await Task.create({
		...body,
		owner: id,
	})
	return task
}

export const readTask = (_id: string, owner: string) => {
	const task = Task.findOne({ _id, owner })
	return task
}

export const updateTask = async (_id: string, owner: string, body: any) => {
	const Updates = Object.keys(body)
	let task: any = await Task.findOne({ _id, owner })

	Updates.forEach((update) => (task[update] = body[update]))

	task = await task.save()

	return task
}

export const deleteTask = (_id: string, owner: string) => {
	const task = Task.findOneAndDelete({ _id, owner })
	return task
}

export const deleteManyTask = async (taskIds: string[], owner: string) => {
	let arg = {}

	if (taskIds && taskIds.length) {
		arg = { _id: { $in: taskIds }, owner }
	} else {
		arg = { owner }
	}

	// if (taskIds === undefined) {
	// 	const task = await Task.deleteMany({ owner })
	// 	return task
	// } else {
	// 	const task = await Task.deleteMany({ _id: { $in: taskIds }, owner })
	// 	return task
	// }
	const task = await Task.deleteMany(arg)

	return task
}
