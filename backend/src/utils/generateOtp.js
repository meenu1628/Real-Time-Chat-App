import crpyto from 'crypto';

 const generateOtp = () => {
    const otp = (crpyto.randomInt(1, 1000000).toString()).padStart(6, '0');
    return otp;
}

export default generateOtp;