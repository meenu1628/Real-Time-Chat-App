import Message from "../models/message.js"
import { handleDbError } from "../utils/handleDbError.js"

const MESSAGE_LIMIT=10
export const getMessageByRoomId = handleDbError(async (roomId,lastTimestamp)=>{
    const messages = (await Message.find({room:roomId,
        isDeleted:false,createdAt:{$lt:lastTimestamp}}).sort({ createdAt: -1 }).limit(MESSAGE_LIMIT).exec()).reverse();
    
    return {messages,lastPage: !messages||messages.length < MESSAGE_LIMIT};
});

export const createMessage = handleDbError( async (messageData) => {
    const newMessage = new Message(messageData);
    // const id=newMessage._id.toString();
    await newMessage.save();
    return newMessage._id;
}); 

export const isValidMessageId = handleDbError(async (messageId) => {
    return await Message.exists({_id:messageId});
});

export const updateMessage = handleDbError(async (messageId, userId, updateData) => {
    const message = await Message.findOneAndUpdate(
        { _id: messageId, sender: userId },
        updateData,
        { new: true }
    );
    return message;
});
