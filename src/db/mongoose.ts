import mongoose from 'mongoose'

const dbUrl: string = process.env.DB_URL || ''

mongoose.connect(dbUrl)
