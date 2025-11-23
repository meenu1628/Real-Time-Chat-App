import jwt from'jsonwebtoken'

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: '14d',
    });
    res.cookie('jwt', token, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development",
    });
};

export const  verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        return null;
    }
}