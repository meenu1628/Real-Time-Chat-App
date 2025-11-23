import { getMessageByRoomId } from "../queries/message.js";

export const getMessages = async (req, res) => {
    try {
        const roomId  = req.user.roomId;
        const lastTimestamp = req.query.lastTimestamp ? parseInt(req.query.lastTimestamp) :Date.now();
        const messages = await getMessageByRoomId(roomId,lastTimestamp);
        res.status(200).json(messages);
    } catch (e) {
        console.log("Error in getMessages controller " + e.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

