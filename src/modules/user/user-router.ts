import { auth, generateAuthToken } from './../../middleware/auth'
import express, { Request, Response } from 'express'
import { createUser, updateUser, userLogin, deleteUser } from './user-service'
import { deleteManyTask } from '../task/task-service'
import {
	validateoperation,
	successResponse,
	errorResponse,
} from './../../helper'
import { errorMessages } from '../../errorMessages'
export const userRouter: express.Router = express.Router()
userRouter.post('/', async (req: Request, res: Response) => {
	try {
		const user = await createUser(req.body)
		const token = await generateAuthToken(user)
		successResponse(res, { user, token }, 201)
	} catch (e) {
		console.log(e)
		errorResponse(res, e)
	}
})
userRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		const user = await userLogin(email, password)
		const token = await generateAuthToken(user)
		successResponse(res, { user, token })
	} catch (e) {
		console.log(e)
		errorResponse(res)
	}
})

userRouter.post('/logout', auth, async (req: Request, res: Response) => {
	try {
		const { user, token } = req.body
		user.tokens = user.tokens.filter((userToken: string) => {
			return userToken !== token
		})

		await user.save()
		successResponse(res)
	} catch (e) {
		console.log(e)
		errorResponse(res, e, 500)
	}
})

userRouter.post('/logoutAll', auth, async (req: Request, res: Response) => {
	try {
		const { user } = req.body
		user.tokens = []
		await user.save()
		successResponse(res)
	} catch (e) {
		console.log(e)
		errorResponse(res, e, 500)
	}
})

userRouter.get('/', auth, async (req: Request, res: Response) => {
	successResponse(res, { data: req.body.user })
})

userRouter.patch('/', auth, async (req: Request, res: Response) => {
	try {
		if (
			!validateoperation(req.body, ['name', 'email', 'password', 'age'])
		) {
			throw new Error(errorMessages.inValidUpdates)
		}

		const user = await updateUser(req.body.user, req.body)
		successResponse(res, user)
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		errorResponse(res, { message })
	}
})

userRouter.delete('/', auth, async (req: Request, res: Response) => {
	try {
		const { user } = req.body
		const userId = user._id
		await deleteUser(userId)
		await deleteManyTask([], userId)
		successResponse(res, user)
	} catch (e) {
		console.log(e)
		errorResponse(res, e, 500)
	}
})
