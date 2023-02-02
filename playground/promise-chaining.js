import("../src/db/mongoose.js");
import { User } from "../src/models/user.js";

// User.findByIdAndUpdate('63ca43bb2838a21c0e1f99f9', {age: 1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then ((result) => {
//     console.log(result)
// }).catch ((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("63ca43bb2838a21c0e1f99f9", 2)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
