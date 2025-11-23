import { Server } from 'socket.io';
import authorizer from './authorizer.js';
import { registerMessageHandlers, registerOnlineHandlers } from './handler/messageHandler.js';
import { registerRoomHandlers } from './handler/roomHandler.js';
import { addOnlineUser, removeOnlineUser } from './managers/onlineUsers.js';
import { getRoomIdsByUserId } from '../queries/room.js';
import { registerRequestHandlers } from './handler/userHandler.js';

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  io.use(authorizer);

  io.on('connection', (socket) => {
    if (socket.user.id) {
      addOnlineUser(socket.user.id, socket.id);
    }

    registerMessageHandlers(io, socket);
    registerOnlineHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerRequestHandlers(io, socket);

    socket.on("disconnect", () => {
      if (socket.user.id) {
        removeOnlineUser(socket.user.id);
        getRoomIdsByUserId(socket.user.id).then((rooms) => {
          rooms.forEach((room) => {
            socket.to(room._id+'').emit("room:member_left", { roomId: room._id+'', userId: socket.user.id });
          })
        });
      }
    });


  });

  return io;
}
export default setupSocket;