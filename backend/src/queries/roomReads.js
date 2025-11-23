import RoomReads from "../models/roomReads";
import { handleDbError } from "../utils/handleDbError";

export const createRoomRead = handleDbError(async (roomId, usersId) => {
    for (const userId of usersId) {
        const roomRead = new RoomReads({
            room: roomId,
            user: userId,
            lastReadMessage: null,
            readAt: Date.now()
        });
        await roomRead.save();
    }
});

export const updateRoomRead=handleDbError(async (roomId,userId,lastReadMessage,timeStamp)=>{
    await RoomReads.updateOne({ room: roomId, user: userId }, 
        { lastReadMessage: lastReadMessage, readAt:timeStamp}
    );
});

export const getRoomByUserId =handleDbError(async (userId,roomsId) => {
    return await RoomReads.find({   user: userId,   room: { $in: roomsId } });
});

export const getRoomRead = handleDbError(async (roomId) => {
    return await RoomReads.find({ user: userId , roomRead:roomId});
});