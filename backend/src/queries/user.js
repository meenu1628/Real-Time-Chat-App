import { handleDbError } from "../utils/handleDbError.js";
import { User } from "../models/user.js";
export const createUser = handleDbError(async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser._id;
});
export const isEmailExists = handleDbError(async (email) => {
  return await User.exists({ email });
});

export const isUsernameExists = handleDbError(async (username) => {
  return await User.exists({ username });
});

export const getUserById = handleDbError(async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
});

export const isValidUserId = handleDbError(async (userId) => {
  return await User.exists({ _id: userId });

});
export const verifyPasswordUsingUsernameOrEmail = handleDbError(async (usernameOrEmail, enteredPassword) => {
  let user;
  if (usernameOrEmail.includes('@'))
    user = await User.findOne({ email: usernameOrEmail })
  else
    user = await User.findOne({ username: usernameOrEmail })
  if (!user) return false;
  const isMatch = await user.comparePassword(enteredPassword);
  return isMatch ? user : '';
});

export const getUsersByName = handleDbError(async (name, skip = 0, dontInclude) => {
  const regex = new RegExp(name, 'i');
  const users = await User.find({
    _id: { $nin: dontInclude },
    $or: [{ fullname: regex }, { username: regex }]
  }).select('-password -email')
    .skip(skip)
    .limit(10)
    .exec();
  return {
    users,
    hasMore: users && users.length == 10,
  };
});

export const updateUserById = handleDbError(async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
  return updatedUser;
});