import mongoose from 'mongoose'

const dbUrl: any = process.env.DB_URL

mongoose.connect(dbUrl)

// const me = new User({
//     name: '  Neel   ',
//     email: '  Nel@MEad.io  ',
//     password: ' abhd  '
//     // age: 27
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })

// const newTask = new Task({
//     description: '  Eat lunch  ',
//     completed: false
// })

// newTask.save().then(() => {
//     console.log(newTask)
// }).catch((error) => {
//     console.log(error)
// })
