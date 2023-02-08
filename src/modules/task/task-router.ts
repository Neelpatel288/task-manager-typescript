import express, { Request, Response } from 'express'
import {
	createTask,
	readTask,
	updateTask,
	deleteTask,
	deleteManyTask,
} from './task-service'
import {
	checkValidIdLength,
	validateoperation,
	successResponse,
	errorResponse,
} from './../../helper'
import { auth } from '../../middleware/auth'
import { errorMessages } from '../../errorMessages'
export const taskRouter: express.Router = express.Router()

taskRouter.post('/', auth, async (req: Request, res: Response) => {
	try {
		const task = await createTask(req.body, req.body.user._id)
		successResponse(res, task, 201)
	} catch (e) {
		console.log(e)
		errorResponse(res, e)
	}
})

taskRouter.get('/', auth, async (req: Request, res: Response) => {
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
		successResponse(res, user.tasks)
	} catch (e) {
		console.log(e)
		errorResponse(res, e, 500)
	}
})

taskRouter.get('/:id', auth, async (req: Request, res: Response) => {
	const ownerId = req.body.user._id
	const taskId = req.params.id
	try {
		if (!checkValidIdLength) {
			throw new Error(errorMessages.provideValidId)
		}

		const task = await readTask(taskId, ownerId)
		if (!task) {
			throw new Error(errorMessages.taskNotFound)
		}
		successResponse(res, task)
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		errorResponse(res, { message })
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

		const task = await updateTask(taskId, ownerId, req.body)
		if (!task) {
			throw new Error(errorMessages.taskNotFound)
		}
		successResponse(res, task)
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		errorResponse(res, { message })
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
			throw new Error(errorMessages.taskNotFound)
		}
		successResponse(res, task)
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		errorResponse(res, { message }, 500)
	}
})

taskRouter.delete('/', auth, async (req: Request, res: Response) => {
	const taskIds = req.body.taskIds
	const ownerId = req.body.owner || req.body.user._id

	try {
		const task = await deleteManyTask(taskIds, ownerId)
		if (!task) {
			throw new Error(errorMessages.taskNotFound)
		}
		successResponse(res, task)
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		errorResponse(res, { message }, 500)
	}
})
