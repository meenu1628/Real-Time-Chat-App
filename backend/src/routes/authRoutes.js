import express from 'express'
import { signup, login,verifyEmail,logout,getCurrentUser} from '../controllers/authController.js'
import authorizer from '../middlewares/authorizer.js';
const authRoutes = express.Router();
authRoutes.get("/status", authorizer,getCurrentUser);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/verifyEmail", verifyEmail);

export default authRoutes;
