import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  },
}, { timestamps: true });

otpSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });


otpSchema.methods.compareOtp = async function (candidateOtp) {
  return await bcrypt.compare(candidateOtp, this.otp);
};

export const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);