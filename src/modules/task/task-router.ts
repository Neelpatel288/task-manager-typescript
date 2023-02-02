import express from 'express'
import { postTask, getTask, patchTask, deleteTask } from './task-service'
import { checkValidIdLength, validateoperation } from '../../helper'
import { auth } from '../../middleware/auth'
import { errorMessages } from '../../errorMessages'
export const taskRouter: express.Router = express.Router()

taskRouter.post('/', auth, async (req, res) => {
	try {
		const task = await postTask(req.body, req.body.user._id)
		res.status(201).send({ data: task })
	} catch (e) {
		console.log(e)
		res.status(400).send(e)
	}
})

taskRouter.get('/all', auth, async (req, res) => {
	const match = {}
	const sort = {}

	if (req.query.completed) {
		match.completed = req.query.completed === 'true'
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(':')
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	}

	try {
		await req.body.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort,
			},
		})
		res.send({ data: req.body.user.tasks })
	} catch (e) {
		console.log(e)
		res.status(500).send(e)
	}
})

taskRouter.get('/:id', auth, async (req, res) => {
	const ownerId = req.body.user._id
	const taskId = req.params.id
	try {
		if (!checkValidIdLength === 24) {
			throw new Error(errorMessages.provideValidId)
		}

		const task = await getTask(taskId, ownerId)
		if (!task) {
			throw new Error(errorMessages.notFound)
		}
		res.send({ data: task })
	} catch (e) {
		console.log(e.message)
		const { message } = e
		res.status(400).send({ message, status: 400 })
	}
})

taskRouter.patch('/:id', auth, async (req, res) => {
	const taskId = req.params.id
	const ownerId = req.body.user._id
	try {
		if (!checkValidIdLength === 24) {
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
	} catch (e) {
		console.log(e.message)
		const { message } = e
		res.status(400).send({ message, status: 400 })
	}
})

taskRouter.delete('/:id', auth, async (req, res) => {
	const taskId = req.params.id
	const ownerId = req.body.user._id

	try {
		if (!checkValidIdLength === 24) {
			throw new Error(errorMessages.provideValidId)
		}

		const task = await deleteTask(taskId, ownerId)
		if (!task) {
			throw new Error(errorMessages.notFound)
		}
		res.send({ data: task })
	} catch (e) {
		console.log(e.message)
		const { message } = e
		res.status(500).send({ message, status: 500 })
	}
})
