import Room from "../../models/room.js";
import { createMessage, updateMessage } from "../../queries/message.js";
import { updateRoomById } from "../../queries/room.js";
import { debounce } from "../managers/debounceTimers.js";
import { isUserOnline } from "../managers/onlineUsers.js";
const MAX_TIME_LIMIT= 5*60*1000;

export const  registerMessageHandlers = (io, socket)=>{
  socket.on("message:send", (data)=> onsendMessage(io,socket,data));
  socket.on("message:delete", ({messageId, roomId})=>{
    if(!messageId||!roomId) return;
    const success=updateMessage(messageId,socket.user.id,{isDeleted:true});
    if(!success) return socket.emit("error", {message:"Message Not Found"});
    socket.to(roomId).emit("message:deleted", {messageId,roomId});
  });
};



export const registerOnlineHandlers = (io, socket)=> {
  socket.on("get-online-users",({userIds})=>{
    socket.emit('online-users',{userIds: userIds.filter(id=> isUserOnline(id))});
  });

  socket.on("typing:start", ({ roomId }) => {
    socket.to(roomId).emit("user:typing", { userId: socket.user.id,roomId,isTyping:true });
  });

  socket.on("typing:stop", ({ roomId }) => {
    socket.to(roomId).emit("user:typing", { userId: socket.user.id,roomId,isTyping:false });
  });
};


const onsendMessage  = async (io,socket,message)=>{
  const {type,_id,content,room,sentAt}=message;
  if(!type||!content||!sentAt||!room){
    return socket.emit("error", {message:"Invalid Message Due To Internal Wokring At Client Side"});
  }
 
  // if(Date.now()-sentAt>MAX_TIME_LIMIT){
  //   return socket.emit("isSent",{ room , tempId });
  // }

  const newMessage = {
    room,
    sender: socket.user.id,
    type,
    content,
    createdAt: Date.now(),
    sentAt:new Date(sentAt).getTime()
  };
  const newId  = await createMessage(newMessage);
  newMessage._id = newId;
  socket.emit("message:delivered",{tempId:_id,message:newMessage});
  socket.to(room).emit("message:new", {message:newMessage});
  debounce(room, async () => {
    await updateRoomById(room, { lastMessage: newId });
})}


