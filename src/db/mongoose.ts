import mongoose from 'mongoose'

const dbUrl: any = process.env.DB_URL

mongoose.connect(dbUrl)
