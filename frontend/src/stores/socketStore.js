// stores/socketStore.js
import { create } from "zustand";
import { SocketServiceInstance } from "../lib/socket";
import { SOCKET_EVENTS } from "../lib/type";

// Zustand store for socket management
const useSocketStore = create((set, get) => ({
  isConnected: false,
  socketId: null,
  currentUser: null,

  // Connect and initialize socket
  connect: async (user) => {
    if (!user) return;
    try {
      await SocketServiceInstance.connect(user);
      set({
        isConnected: true,
        socketId: SocketServiceInstance.getSocketId(),
        currentUser: user,
      });

      // Register core event listeners (add more as needed)
      SocketServiceInstance.on(SOCKET_EVENTS.CONNECTION_ESTABLISHED, ({ socketId }) => {
        set({ isConnected: true, socketId });
      });
      
      SocketServiceInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
        set({ isConnected: false, socketId: null });
      });
      SocketServiceInstance.on(SOCKET_EVENTS.CONNECT_ERROR, () => {
        set({ isConnected: false, socketId: null });
      });
    } catch (err) {
      set({ isConnected: false, socketId: null });
    }
  },

  disconnect: () => {
    SocketServiceInstance.disconnect();
    set({ isConnected: false, socketId: null, currentUser: null });
  },

  sendMessage: (data) => {
    try {
      SocketServiceInstance.sendMessage(data);
    } catch (err) {
    
    }
  },

  editMessage: (messageId, content) => {
    try {
      SocketServiceInstance.editMessage(messageId, content);
    } catch (err) {}
  },

  deleteMessage: (messageId, roomId) => {
    try {
      SocketServiceInstance.deleteMessage(messageId, roomId);
    } catch (err) {}
  },

  markMessageAsRead: (messageId, roomId) => {
    try {
      SocketServiceInstance.markMessageAsRead(messageId, roomId);
    } catch (err) {}
  },

  markRoomAsRead: (roomId, lastReadMessageId) => {
    try {
      SocketServiceInstance.markRoomAsRead(roomId, lastReadMessageId);
    } catch (err) {}
  },

  joinRoom: (roomId) => {
    try {
      SocketServiceInstance.joinRoom(roomId);
    } catch (err) {}
  },

  leaveRoom: (roomId) => {
    try {
      SocketServiceInstance.leaveRoom(roomId);
    } catch (err) {}
  },

  createRoom: (data) => {
    try {
      SocketServiceInstance.createRoom(data);
    } catch (err) {}
  },

  updateRoom: (roomId, updates) => {
    try {
      SocketServiceInstance.updateRoom(roomId, updates);
    } catch (err) {}
  },
  requestAccept:(requestId) => {
    try {
      SocketServiceInstance.requestAccept(requestId);
    } catch (err) {}
  },
  requestSend: (userIds,groupName) => {
    try {
      SocketServiceInstance.requestSend(userIds,groupName);
    } catch (err) {}
  },
  requestReject: (requestId) => {
    try {
      SocketServiceInstance.requestReject(requestId);
    } catch (err) {}
  },
  requestUnsend: (requestId) => {
    try {
      SocketServiceInstance.requestUnsend(requestId);
    } catch (err) {}
  },
  startTyping: (roomId) => {
    try {
      SocketServiceInstance.startTyping(roomId);
    } catch (err) {}
  },

  stopTyping: (roomId) => {
    try {
      SocketServiceInstance.stopTyping(roomId);
    } catch (err) {}
  },

  updatePresence: (status) => {
    try {
      SocketServiceInstance.updatePresence(status);
    } catch (err) {}
  },

  // Utility: subscribe to custom events
  on: (event, callback) => {
    SocketServiceInstance.on(event, callback);
  },
  off: (event, callback) => {
    SocketServiceInstance.off(event, callback);
  },
}));

export default useSocketStore;
