import { createRoomByUserId, getRoomByUserId, getRoomsByUserId, updateRoomById } from "../queries/room.js";
import { isValidUserId } from "../queries/user.js";

export const getRooms=async(req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        if (page < 1) {
            return res.status(400).json({ error: "Page number must be greater than 0" });
        }
        const rooms = await getRoomsByUserId(req.user.id);
        res.status(200).json({rooms});
    } catch (e) {
        console.log("Error in getRooms controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        if (!roomId) {
            return res.status(400).json({ error: "Room ID is required" });
        }
        const room = await getRoomByUserId(req.user.id, roomId);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.status(200).json(room);
    } catch (e) {
        console.log("Error in getRoom controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const createRoom = async (req, res) => {
    try {
        const {isGroup,members,groupSettings } = req.body;
        if(isGroup){
            if(members.length<1){
                return res.status(400).json({ error: "At least one member is required for group chat" });
            }
            if(members.length>=50){
                return res.status(400).json({ error: "Group chat can have a maximum of 50 members" });
            }
            if(!groupSettings|| !groupSettings.groupName){
                return res.status(400).json({ error: "Group settings with group name are required" });
            }
            for(const member of members){
                if(! await isValidUserId(member)){
                    return res.status(400).json({ error: "Invalid user ID in members" });
                }
            }
            members.push(req.user.id); // Add the creator to the group
            const room = await createRoomByUserId({
                members: members,
                isGroup: true,
                groupSettings:{
                    groupName: groupSettings.groupName,
                    groupImage: groupSettings.groupImage,
                    admins:[req.user.id],
                    createdBy: req.user.id,
                }
            });
            if(!room){
                return res.status(500).json({ error: "Failed to create group room" });
            }
            return res.status(201).json({ message: "Group room created successfully", room });
        }else{
            if(members.length!=1){
                return res.status(400).json({ error: "For one-on-one chat, only one member is allowed" });
            }

            if(! await isValidUserId(members[0])){
                return res.status(400).json({ error: "Invalid user ID in members" });
            }
            members.push(req.user.id); 
            const room= await createRoomByUserId({
                members: members,
                isGroup: false,
            })
            if(!room){
                return res.status(500).json({ error: "Failed to create one-on-one room" });
            }
            return res.status(201).json({ message: "Room created successfully", room });

        }
    } catch (e) {
        console.log("Error in createRoom controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};
export const updateRoom = async (req, res) => {
    const roomId = req.params.roomId;
    const updateData = req.body;
    const success= await updateRoomById(roomId, updateData);
    if (!success) {
        return res.status(404).json({ error: "Room not found" });
    }else {
        return res.status(200).json({ message: "Room updated successfully" });
    } 
} 
export const deleteRoom = async (req, res) => {
    return res.status(501).json({ error: "Delete room functionality is not implemented yet" });
}


