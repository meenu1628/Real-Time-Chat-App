import { handleDbError } from "../utils/handleDbError.js";
import { Otp } from "../models/otp.js";

export const createOtp = handleDbError(async (otpData) => {
    const otp=await Otp.findOneAndUpdate(
        { email: otpData.email },
        { $set:otpData},
        { upsert: true, new: true });
    return otp._id;
});

export const verifyOtpAndGetUser = handleDbError(async (email,enteredOtp)=>{
    const otp= await Otp.findOne({email:email});
    if(!otp) return {};
    const match=await otp.compareOtp(enteredOtp);
    if(match){
       const userData=  {
            email: otp.email,
            username: otp.username,
            fullname: otp.fullname,
            password: otp.password,
        };
        await Otp.deleteOne({email: email});
        return userData;
    }

});
