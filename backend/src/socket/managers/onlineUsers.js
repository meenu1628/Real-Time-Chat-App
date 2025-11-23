const onlineUsers = new Map() // userId => socket.id

export function addOnlineUser(userId, socketId) {
  onlineUsers.set(userId+'', socketId+'')
}

export function removeOnlineUser(userId) {
  onlineUsers.delete(userId+'')
}

export function getOnlineUsers() {
  return Array.from(onlineUsers.keys())
}

export function getSocketId(userId) {
  return onlineUsers.get(userId+'')
}

export function isUserOnline(userId) {
  return onlineUsers.has(userId+'')
}

