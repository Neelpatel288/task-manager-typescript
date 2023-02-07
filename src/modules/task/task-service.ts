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

export const deleteManyTask = (owner: string) => {
	const task = Task.deleteMany({ owner })
	return task
}

export const findAndDeleteManyTask = async (taskIds: any, owner: string) => {
	const task1 = await Task.find({ _id: { $in: taskIds }, owner })
	const tasks = await Task.deleteMany({
		_id: { $in: task1.map((task) => task._id) },
	})

	return tasks
}
