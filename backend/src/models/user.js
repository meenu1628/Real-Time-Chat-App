import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isUserOnline } from "../socket/managers/onlineUsers.js";
const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    lastSeen:{
      type:Number,
      default: Date.now(),
    }
  },
  { timestamps: true });


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.virtual('isOnline').get(function () {
  return isUserOnline(this._id);
});
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);
