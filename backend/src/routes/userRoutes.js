import express from 'express'
import { getUser, updateUser, 
    // deleteUser,
    getUserRequests,
     searchUser } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.route("/").get(getUser).patch(updateUser)
// .delete(deleteUser);
userRoutes.get("/search",searchUser);
userRoutes.get("/requests", getUserRequests);

export default userRoutes;