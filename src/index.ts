import express from 'express'
import * as dotenv from 'dotenv'
import('./db/mongoose')
import { userRouter } from './modules/user/user-router'
import { taskRouter } from './modules/task/task-router'
dotenv.config()

const app: express.Application = express()
const port = process.env.PORT

app.use(express.json())
app.use('/user', userRouter)
app.use('/task', taskRouter)

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})
