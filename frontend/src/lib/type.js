// Socket error codes
export const SOCKET_ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  MESSAGE_NOT_FOUND: "MESSAGE_NOT_FOUND",
  INVALID_DATA: "INVALID_DATA",
  RATE_LIMITED: "RATE_LIMITED",
  SERVER_ERROR: "SERVER_ERROR",
  CONNECTION_FAILED: "CONNECTION_FAILED",
}

// Socket event names
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Messages
  MESSAGE_NEW: "message:new",
  MESSAGE_UPDATED: "message:updated",
  MESSAGE_DELETED: "message:deleted",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ: "message:read",

  // Rooms
  ROOM_CREATED: "room:created",
  ROOM_UPDATED: "room:updated",
  ROOM_DELETED: "room:deleted",
  ROOM_MEMBER_JOINED: "room:member_joined",
  ROOM_MEMBER_LEFT: "room:member_left",
  ROOM_READ: "room:read",

  // Users
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  USER_TYPING: "user:typing",

  // Custom events
  CONNECTION_ESTABLISHED: "connection:established",
  CONNECTION_LOST: "connection:lost",
  CONNECTION_ERROR: "connection:error",
  CONNECTION_FAILED: "connection:failed",
}

// Default socket configuration
export const DEFAULT_SOCKET_CONFIG = {
  url:  import.meta.env.VITE_SERVER_URL|| "http://localhost:3000",
  options: {
    transports: ["polling","websocket"],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 2,
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 2,
    forceNew: false,
    autoConnect: false,
    withCredentials: true,
  },
}

// Message types
export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  AUDIO: "audio",
  VIDEO: "video",
  SYSTEM: "system",
}

// User presence statuses
export const PRESENCE_STATUS = {
  ONLINE: "online",
  AWAY: "away",
  BUSY: "busy",
  OFFLINE: "offline",
}

// Room types
export const ROOM_TYPES = {
  DIRECT: "direct",
  GROUP: "group",
//   CHANNEL: "channel",
//   BROADCAST: "broadcast",
}