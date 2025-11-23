import { isValidRoomId } from "../queries/room.js";

export const validateRoomId = async  (req, res, next) => {
    const validRoomId = req.params.roomId;
    if(!validRoomId) 
        return res.status(400).json({ error: "Room ID is required" });
    const valid = await isValidRoomId(validRoomId, req.user.id);
    if(! valid) {
        return res.status(403).json({ error: "Forbidden - Invalid Room ID" });
    }
    req.user.roomId = validRoomId; 
    next();
}

