// import { useEffect } from "react"
// import { SocketServiceInstance } from "../lib/socket"
// import useChatStore from "../stores/chatStore"

// export function useSocketEvents() {
//   // const addOrUpdateMessage = useChatStore((s) => s.addOrUpdateMessage)

//   useEffect(() => {
//     const handleMessageUpdated = (message) => {
//       console.log("Frontend got updated message:", message)
//       // addOrUpdateMessage(message)
//     }

//     SocketServiceInstance.on("message:updated", handleMessageUpdated)

//     return () => {
//       SocketServiceInstance.off("message:updated", handleMessageUpdated)
//     }
//   }, [])
// }


// // import { useEffect, useRef, useCallback } from "react"
// // import { SocketServiceInstance} from "../lib/socket"
// // import { SOCKET_EVENTS } from "../lib/type"
// // import useChatStore from "../stores/chatStore"

// // export function useSocket() {
// //   const isInitialized = useRef(false)
// //   const reconnectTimeoutRef = useRef()

// //   // Chat store actions
// //   const currentUser = useChatStore((state) => state.currentUser)
// //   const setConnectionStatus = useChatStore((state) => state.setConnectionStatus)
// //   const addMessage = useChatStore((state) => state.addMessage)
// //   const updateMessage = useChatStore((state) => state.updateMessage)
// //   const deleteMessage = useChatStore((state) => state.deleteMessage)
// //   const updateMessageId = useChatStore((state) => state.updateMessageId)
// //   const markMessageAsFailed = useChatStore((state) => state.markMessageAsFailed)
// //   const addRoom = useChatStore((state) => state.addRoom)
// //   const updateRoom = useChatStore((state) => state.updateRoom)
// //   const setUserOnline = useChatStore((state) => state.setUserOnline)
// //   const setTyping = useChatStore((state) => state.setTyping)
// //   const removeTyping = useChatStore((state) => state.removeTyping)
// //   const markRoomAsRead = useChatStore((state) => state.markRoomAsRead)

// //   // ========================================
// //   // SOCKET EVENT HANDLERS
// //   // ========================================

// //   const handleNewMessage = useCallback(
// //     (data) => {
// //       console.log("📨 Handling new message:", data)

// //       // Transform MongoDB document to frontend type if needed
// //       const message = data.message
// //       const room = data.room

// //       // If using DocumentTransformer (uncomment if needed)
// //       // const message = DocumentTransformer.messageDocumentToMessage(data.message)
// //       // const room = DocumentTransformer.roomDocumentToRoom(data.room, currentUser?.id || "", message)

// //       // If this is a response to our optimistic update, update the message ID
// //       if (data.tempId) {
// //         updateMessageId(data.tempId, message.id, {
// //           createdAt: message.createdAt,
// //           sentAt: message.sentAt,
// //           isConfirmed: true,
// //         })
// //       } else {
// //         // This is a new message from another user
// //         addMessage(message)
// //       }

// //       // Update room with new last message
// //       updateRoom({
// //         id: room.id,
// //         lastMessage: message,
// //         lastMessageId: message.id,
// //         updatedAt: new Date(message.createdAt),
// //       })
// //     },
// //     [currentUser?.id, addMessage, updateRoom, updateMessageId],
// //   )

// //   const handleMessageUpdated = useCallback(
// //     (data) => {
// //       ("✏️ Handling message update:", data)
// //       updateMessage({
// //         id: data.messageId,
// //         roomId: data.roomId,
// //         ...data.updates,
// //       })
// //     },
// //     [updateMessage],
// //   )

// //   const handleMessageDeleted = useCallback(
// //     (data) => {
// //       console.log("🗑️ Handling message deletion:", data)
// //       deleteMessage(data.messageId, data.roomId)
// //     },
// //     [deleteMessage],
// //   )

// //   const handleRoomCreated = useCallback(
// //     (data) => {
// //       console.log("🏠 Handling room creation:", data)
// //       // Transform if needed
// //       const room = data.room
// //       // const room = DocumentTransformer.roomDocumentToRoom(data.room, currentUser?.id || "")
// //       addRoom(room)
// //     },
// //     [currentUser?.id, addRoom],
// //   )

// //   const handleRoomUpdated = useCallback(
// //     (data) => {
// //       console.log("🏠 Handling room update:", data)
// //       updateRoom({
// //         id: data.roomId,
// //         ...data.updates,
// //       })
// //     },
// //     [updateRoom],
// //   )

// //   const handleUserOnline = useCallback(
// //     (data) => {
// //       console.log("🟢 User came online:", data)
// //       setUserOnline(data.userId, true)
// //     },
// //     [setUserOnline],
// //   )

// //   const handleUserOffline = useCallback(
// //     (data) => {
// //       console.log("🔴 User went offline:", data)
// //       setUserOnline(data.userId, false)
// //     },
// //     [setUserOnline],
// //   )

// //   const handleUserTyping = useCallback(
// //     (data) => {
// //       if (data.isTyping) {
// //         setTyping({
// //           userId: data.userId,
// //           roomId: data.roomId,
// //           timestamp: new Date(),
// //         })
// //       } else {
// //         removeTyping(data.userId, data.roomId)
// //       }
// //     },
// //     [setTyping, removeTyping],
// //   )

// //   const handleRoomRead = useCallback(
// //     (data) => {
// //       // Only update if it's the current user
// //       if (data.userId === currentUser?.id) {
// //         markRoomAsRead(data.roomId)
// //       }
// //     },
// //     [currentUser?.id, markRoomAsRead],
// //   )

// //   const handleConnectionEstablished = useCallback(() => {
// //     console.log("✅ Socket connection established")
// //     setConnectionStatus(true)

// //     // Clear any reconnection timeout
// //     if (reconnectTimeoutRef.current) {
// //       clearTimeout(reconnectTimeoutRef.current)
// //     }
// //   }, [setConnectionStatus])

// //   const handleConnectionLost = useCallback(
// //     (data) => {
// //       console.log("🔌 Socket connection lost:", data.reason)
// //       setConnectionStatus(false)

// //       // Attempt to reconnect after a delay
// //       reconnectTimeoutRef.current = setTimeout(() => {
// //         if (currentUser) {
// //           console.log("🔄 Attempting to reconnect...")
// //           initializeSocket(currentUser)
// //         }
// //       }, 3000)
// //     },
// //     [setConnectionStatus, currentUser],
// //   )

// //   const handleConnectionError = useCallback(
// //     (data) => {
// //       console.error("🚨 Socket connection error:", data)
// //       setConnectionStatus(false)

// //       // Handle specific error codes
// //       if (data.code === "UNAUTHORIZED") {
// //         // Redirect to login or refresh token
// //         console.error("❌ Socket authentication failed")
// //       }
// //     },
// //     [setConnectionStatus],
// //   )

// //   // ========================================
// //   // SOCKET INITIALIZATION
// //   // ========================================

// //   const initializeSocket = useCallback(
// //     async (user) => {
// //       if (isInitialized.current) return

// //       try {
// //         // Connect to socket
// //         console.log("🔌 Initializing socket connection for user:", user._id)
// //         await SocketServiceInstance.connect(user)
// //         console.log("✅ Socket connected:", SocketServiceInstance.getSocketId())
// //         // Set up event listeners
// //         SocketServiceInstance.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage)
// //         SocketServiceInstance.on(SOCKET_EVENTS.MESSAGE_UPDATED, handleMessageUpdated)
// //         SocketServiceInstance.on(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted)
// //         SocketServiceInstance.on(SOCKET_EVENTS.ROOM_CREATED, handleRoomCreated)
// //         SocketServiceInstance.on(SOCKET_EVENTS.ROOM_UPDATED, handleRoomUpdated)
// //         SocketServiceInstance.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline)
// //         SocketServiceInstance.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline)
// //         SocketServiceInstance.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping)
// //         SocketServiceInstance.on(SOCKET_EVENTS.ROOM_READ, handleRoomRead)
// //         SocketServiceInstance.on(SOCKET_EVENTS.CONNECTION_ESTABLISHED, handleConnectionEstablished)
// //         SocketServiceInstance.on(SOCKET_EVENTS.CONNECTION_LOST, handleConnectionLost)
// //         SocketServiceInstance.on(SOCKET_EVENTS.CONNECTION_ERROR, handleConnectionError)

// //         isInitialized.current = true
// //         console.log("✅ Socket initialized successfully")
// //       } catch (error) {
// //         console.error("❌ Failed to initialize socket:", error)
// //         setConnectionStatus(false)
// //       }
// //     },
// //     [
// //       handleNewMessage,
// //       handleMessageUpdated,
// //       handleMessageDeleted,
// //       handleRoomCreated,
// //       handleRoomUpdated,
// //       handleUserOnline,
// //       handleUserOffline,
// //       handleUserTyping,
// //       handleRoomRead,
// //       handleConnectionEstablished,
// //       handleConnectionLost,
// //       handleConnectionError,
// //       setConnectionStatus,
// //     ],
// //   )

// //   // ========================================
// //   // SOCKET OPERATIONS
// //   // ========================================

// //   const sendMessage = useCallback(
// //     (tempId, roomId, content, type = "text") => {
// //       try {
// //         SocketServiceInstance.sendMessage({ tempId, roomId, content, type })
// //       } catch (error) {
// //         console.error("❌ Failed to send message:", error)
// //         markMessageAsFailed(tempId, "Failed to send message")
// //       }
// //     },
// //     [markMessageAsFailed],
// //   )

// //   const joinRoom = useCallback((roomId) => {
// //     SocketServiceInstance.joinRoom(roomId)
// //   }, [])

// //   const leaveRoom = useCallback((roomId) => {
// //     SocketServiceInstance.leaveRoom(roomId)
// //   }, [])

// //   const startTyping = useCallback((roomId) => {
// //     SocketServiceInstance.startTyping(roomId)
// //   }, [])

// //   const stopTyping = useCallback((roomId) => {
// //     SocketServiceInstance.stopTyping(roomId)
// //   }, [])

// //   const markMessageAsRead = useCallback((messageId, roomId) => {
// //     SocketServiceInstance.markMessageAsRead(messageId, roomId)
// //   }, [])

// //   const markRoomAsReadSocket = useCallback((roomId, lastReadMessageId) => {
// //     SocketServiceInstance.markRoomAsRead(roomId, lastReadMessageId)
// //   }, [])

// //   // ========================================
// //   // LIFECYCLE MANAGEMENT
// //   // ========================================

// //   // useEffect(() => {
// //   //   if (currentUser && !isInitialized.current) {
    
// //   //     initializeSocket(currentUser)
// //   //   }

// //   //   return () => {
// //   //     if (reconnectTimeoutRef.current) {
// //   //       clearTimeout(reconnectTimeoutRef.current)
// //   //     }
// //   //   }
// //   // }, [currentUser, initializeSocket])

// //   // useEffect(() => {
// //   //   return () => {
// //   //     // Cleanup on unmount
// //   //     SocketServiceInstance.disconnect()
// //   //     isInitialized.current = false
// //   //   }
// //   // }, [])

// //   // ========================================
// //   // RETURN SOCKET OPERATIONS
// //   // ========================================

// //   return {
// //     // Connection status
// //     isConnected: SocketServiceInstance.isConnected(),
// //     socketId: SocketServiceInstance.getSocketId(),

// //     // Message operations
// //     sendMessage,
// //     markMessageAsRead,
// //     markRoomAsRead: markRoomAsReadSocket,

// //     // Room operations
// //     joinRoom,
// //     leaveRoom,

// //     // Typing operations
// //     startTyping,
// //     stopTyping,

// //     // Utility
// //     disconnect: () => SocketServiceInstance.disconnect(),
// //     reconnect: () => currentUser && initializeSocket(currentUser),
// //   }
// // }
