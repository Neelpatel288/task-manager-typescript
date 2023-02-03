import { Task } from '../../models/task'

export const postTask = async (body: any, id: string) => {
	const task = await Task.create({
		...body,
		owner: id,
	})
	return task
}

export const getTask = (_id: string, owner: string) => {
	const task = Task.findOne({ _id, owner })
	return task
}

export const patchTask = async (_id: string, owner: string, body: any) => {
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

export const deleteManyTask = (owner: string) => {
	const task = Task.deleteMany({ owner })
	return task
}
