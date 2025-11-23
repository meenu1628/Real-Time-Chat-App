import { verifyToken } from '../utils/token.js';
const authorizer = async (req, res, next) => {
   try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided "});
        }
    
       
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(403).json({ error: "Unauthorized - Invalid token" });
        }
        // Assuming you have a User id is valid in db
        req.user = {
            id: decoded.userId,
        };
        next();
    } catch (e) { 
        console.log("Error in authorizer middleWare " + e.message);
        res.status(500).json({ error: "Invalid Server Error" });
    }
};

export default authorizer;