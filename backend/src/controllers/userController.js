import { get } from "mongoose";
import { getFriends } from "../queries/room.js";
import { getUserById, getUsersByName, updateUserById } from "../queries/user.js";
import { getReceivedRequests, getSentRequests } from "../queries/request.js";

export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (e) {
        console.log("Error in getUser controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}


export const searchUser = async (req, res) => {
    try {
        const SearchQuery = req.query.q;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        if (!SearchQuery) {
            return res.status(400).json({ error: "Search query is required" });
        }
        // const dontInclude= await getFriends(req.user.id);
        const searchedUsers = await getUsersByName(SearchQuery,skip,[req.user.id]);
        return res.status(200).json(searchedUsers);
    } catch (e) {
        console.log("Error in searchUser controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, profilePicture ,fullname} = req.body;

        if (!username && !email && !profilePicture&&!fullname) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updatedUser = await updateUserById(userId, { username, email, profilePicture ,fullname});
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (e) {
        console.log("Error in updateUser controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getUserRequests = async (req, res) => {
    try{
        const userId =req.user.id;
        const receivedReq = getReceivedRequests(userId);
        const sentReq = getSentRequests(userId);
        Promise.all([receivedReq,sentReq]).then((results)=>{
            return res.status(200).json({
                requests:{
                    receivedRequest: results[0],
                    sentRequest: results[1]
                    }
             });
        });
    }catch(e){
        console.log("Error in getUserRequests controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}