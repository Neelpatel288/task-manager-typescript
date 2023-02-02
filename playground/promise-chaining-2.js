import("../src/db/mongoose.js");
import { Task } from "../src/models/task.js";

// Task.findByIdAndDelete('63ca4ea77bece46cbe94aa71').then((task) => {
//     console.log(task)

//     return Task.countDocuments({completed : false})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("63ca30ff11ff45579233ed49")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
