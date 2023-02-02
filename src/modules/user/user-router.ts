import express, { Request, Response } from 'express'
import { postUser, patchUser, userLogin } from './user-service'
import { validateoperation } from '../../helper'
import { auth } from '../../middleware/auth'
import { errorMessages } from '../../errorMessages'
// import { IGetUserAuthInfoRequest } from '../../models/user'

export const userRouter: express.Router = express.Router()
userRouter.post('/', async (req: Request, res: Response) => {
	try {
		const user = await postUser(req.body)
		const token = await user.generateAuthToken()

		res.status(201).send({ data: { user, token } })
	} catch (e) {
		console.log(e)
		res.status(400).send(e)
	}
})

userRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const user = await userLogin(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.send({ data: { user, token } })
	} catch (e) {
		console.log(e)
		res.status(400).send()
	}
})

userRouter.post('/logout', auth, async (req: Request, res: Response) => {
	try {
		const { user, token } = req.body
		user.tokens = user.tokens.filter((userToken: string) => {
			return userToken != token
		})
		await req.body.user.save()
		res.send()
	} catch (e) {
		console.log(e)
		res.status(500).send()
	}
})

userRouter.post('/logoutAll', auth, async (req: Request, res: Response) => {
	try {
		req.body.user.tokens = []
		await req.body.user.save()
		res.send()
	} catch (e) {
		console.log(e)
		res.status(500).send()
	}
})

userRouter.get('/me', auth, async (req: Request, res: Response) => {
	res.send({ data: req.body.user })
})

userRouter.patch('/me', auth, async (req: Request, res: Response) => {
	try {
		if (
			!validateoperation(req.body, ['name', 'email', 'password', 'age'])
		) {
			throw new Error(errorMessages.inValidUpdates)
		}

		const user = await patchUser(req.body.user, req.body)
		res.send({ data: user })
	} catch (e: any) {
		console.log(e.message)
		const { message } = e
		res.status(400).send({ message, status: 400 })
	}
})

userRouter.delete('/me', auth, async (req: Request, res: Response) => {
	try {
		await req.body.user.remove()
		res.send({ data: req.body.user })
	} catch (e) {
		console.log(e)
		res.status(500).send()
	}
})
