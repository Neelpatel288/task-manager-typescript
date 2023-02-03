import express, { Request, Response } from 'express'
import { postTask, getTask, patchTask, deleteTask } from './task-service'
import { checkValidIdLength, validateoperation } from '../../helper'
import { auth } from '../../middleware/auth'
import { errorMessages } from '../../errorMessages'
export const taskRouter: express.Router = express.Router()

taskRouter.post('/', auth, async (req: Request, res: Response) => {
	try {
		const task = await postTask(req.body, req.body.user._id)
		res.status(201).send({ data: task })
	} catch (e) {
		console.log(e)
		res.status(400).send(e)
	}
})

taskRouter.get('/all', auth, async (req: Request, res: Response) => {
	const match: { completed?: boolean } = {}
	const sort: any = {}

	if (req.query.completed) {
		match.completed = req.query.completed === 'true'
	}

	if (req.query.sortBy) {
		const sortBy = req.query.sortBy as string
		const parts = sortBy.split(':')
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	}

	try {
		const { user } = req.body

		await user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit as string),
				skip: parseInt(req.query.skip as string),
				sort,
			},
		})
		res.send({ data: user.tasks })
	} catch (e) {
		console.log(e)
		res.status(500).send(e)
	}
})

taskRouter.get('/:id', auth, async (req: Request, res: Response) => {
	const ownerId = req.body.user._id
	const taskId = req.params.id
	try {
		if (!checkValidIdLength) {
			throw new Error(errorMessages.provideValidId)
		}

		const task = await getTask(taskId, ownerId)
		if (!task) {
			throw new Error(errorMessages.notFound)
		}
		res.send({ data: task })
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		res.status(400).send({ message, status: 400 })
	}
})

taskRouter.patch('/:id', auth, async (req: Request, res: Response) => {
	const taskId = req.params.id
	const ownerId = req.body.user._id
	try {
		if (!checkValidIdLength) {
			throw new Error(errorMessages.provideValidId)
		}

		if (!validateoperation(req.body, ['description', 'completed'])) {
			throw new Error(errorMessages.inValidUpdates)
		}

		const task = await patchTask(taskId, ownerId, req.body)
		if (!task) {
			throw new Error(errorMessages.notFound)
		}

		res.send({ data: task })
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		res.status(400).send({ message, status: 400 })
	}
})

taskRouter.delete('/:id', auth, async (req: Request, res: Response) => {
	const taskId = req.params.id
	const ownerId = req.body.user._id

	try {
		if (!checkValidIdLength) {
			throw new Error(errorMessages.provideValidId)
		}

		const task = await deleteTask(taskId, ownerId)
		if (!task) {
			throw new Error(errorMessages.notFound)
		}
		res.send({ data: task })
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		res.status(500).send({ message, status: 500 })
	}
})
