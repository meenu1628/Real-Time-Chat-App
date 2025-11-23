import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { enableMapSet } from 'immer';
import { apiRequest } from "../lib/utils";
import useSocketStore from "./socketStore";

enableMapSet();
const {
  joinRoom: socketJoinRoom
} = useSocketStore.getState();
const useChatStore = create(
  subscribeWithSelector(
    immer((set, get) => ({
      // State
      currentUser: null,
      users: {},
      rooms: {},
      messages: {},
      activeRoomId: null,
      activeRoom: {},
      lastViewedAt: {},
      lastReadMessages: {},
      pendingMessages: new Map(),
      onlineUsers: new Set(),
      requests: {
        sent: {},
        received: {},
      },
      typingUsers: {},
      messageHistory: {},
      searchQuery: "",
      searchMode: "conversations",
      messageView: "all",
      searchedUsers: {
        hasMore: true,
        users: [],
        skip: 0,
      },
      selectedUsers: new Set(),
      isConnected: false,
      lastActivity: new Date(),
      // Actions
      setCurrentUser: (user) =>
        set((state) => {
          state.currentUser = { ...user, isOnline: true }
          state.users[user._id] = { ...user, isOnline: true }
        }),

      setUsers: (users) =>
        set((state) => {
          users.forEach((user) => {
            state.users[user._id] = user
            get().setUserOnline(user._id, user.isOnline)
          })
        }),

      updateUser: (user) =>
        set((state) => {
          if (state.users[user._id]) {
            Object.assign(state.users[user._id], user)
          }
        }),

      setRooms: (rooms) =>
        set((state) => {
          rooms.forEach((room) => {
            if (state.rooms[room.id]) return
            socketJoinRoom(room._id);

            state.rooms[room._id] = {
              ...room,
              lastMessage: room.lastMessage ? { ...room.lastMessage, sentAt: new Date(room.lastMessage.sentAt) } : {sentAt: new Date(room.createdAt)},
              members: room.members.map((member) => {
                if (!state.users[member._id]) {
                  state.users[member._id] = member
                }
                return member._id
              }
              )
            }



            if (!state.messages[room._id]) {
              state.messages[room._id] = []
            }

            if (!state.messageHistory[room._id]) {
              state.messageHistory[room._id] = {
                hasMore: true,
                isLoading: false,
                offset: 0,
              }
            }
          })
        }),

      addRoom: (room) =>
        set((state) => {
          socketJoinRoom(room._id)
          state.rooms[room._id] = room
          state.messages[room._id] = []
          state.messageHistory[room._id] = {
            hasMore: true,
            isLoading: false,
            offset: 0,
          }
        }),

      updateRoom: (roomUpdate) =>
        set((state) => {
          const room = state.rooms[roomUpdate._id]
          if (room) {
            state.rooms[roomUpdate._id] = {
              ...room,
              members: roomUpdate.members.map((member) => {
                if (!state.users[member._id]) {
                  state.users[member._id] = member
                }
                return member._id
              })
            }
          }
        }),

      deleteRoom: (roomId) =>
        set((state) => {
          delete state.rooms[roomId]
          delete state.messages[roomId]
          delete state.messageHistory[roomId]
          if (state.activeRoomId === roomId) {
            state.activeRoomId = null
          }
        }),

      setActiveRoom: (roomId) =>
        set((state) => {
          if (state.activeRoomId && state.activeRoomId !== roomId) {
            state.lastViewedAt[state.activeRoomId] = new Date()
          }
          state.activeRoomId = roomId
          state.activeRoom = state.rooms[roomId] || {}

          // Mark new room as viewed and reset unread count
          if (roomId) {
            state.lastViewedAt[roomId] = new Date()
            const room = state.rooms[roomId]
            if (room) {
              room.unreadCount = 0
            }
          }
        }),
      setmessageView: (view) =>
        set((state) => {
          state.messageView = view
        }
        ),
      setSentRequest: (requests) =>
        set((state) => {
          if (!requests) return;
          const newSent = { ...state.requests.sent };

          requests.forEach((request) => {
            newSent[request._id] = {
              ...request.receiver,
              requestId: request._id,
              sentAt: new Date(request.sentAt),
              groupName: request.groupName || "",
              isGroup: request.isGroup || false,
              room: request.room || null,
            };
          });

          state.requests.sent = newSent;
        }),

      removeSentRequest: (requestId) =>
        set((state) => {
          const updated = { ...state.requests.sent };
          delete updated[requestId];
          state.requests.sent = updated;
        }),

      removeReceivedRequest: (requestId) =>
        set((state) => {
          const updated = { ...state.requests.received };
          delete updated[requestId];
          state.requests.received = updated;
        }),

      setReceivedRequest: (requests) =>
        set((state) => {
          if (!requests) return;

          const newReceived = { ...state.requests.received };

          requests.forEach((request) => {
            newReceived[request._id] = {
              ...request.sender,
              requestId: request._id,
              sentAt: new Date(request.sentAt),
              groupName: request.groupName || "",
              isGroup: request.isGroup || false,
              room: request.room || null,
            };
          });
          state.requests.received = newReceived;
        }),

      addMessage: (message) =>
        set((state) => {
          const roomMessages = state.messages[message.room] || []
          const existingIndex = roomMessages.findIndex((msg) => msg._id === message._id)
          message.sentAt = new Date(message.sentAt || Date.now())
          if (existingIndex >= 0) {

            roomMessages[existingIndex] = { ...roomMessages[existingIndex], ...message }
          } else {
            roomMessages.push(message)
          }

          if (message._id.startsWith("temp-")) {
            state.pendingMessages.set(message._id, {
              room: message.room,
              sentAt: message.sentAt || new Date(),
            })
          }

          // Update room's last message and unread count
          const room = state.rooms[message.room]
          if (room) {
            room.lastMessage = message
            room.updatedAt = message.sentAt

            const isCurrentRoom = state.activeRoomId === message.room
            const isOwnMessage = message.sender === state.currentUser?._id

            if (!isCurrentRoom && !isOwnMessage) {
              room.unreadCount = (room.unreadCount || 0) + 1
            }

            if (!state.lastReadMessages[message.room]) {
              state.lastReadMessages[message.room] = {}
            }

            if (isOwnMessage) {
              state.lastReadMessages[message.room][message.sender] = message._id
            }
          }
        }),

      updateMessage: (messageUpdate) =>
        set((state) => {
          const roomMessages = state.messages[messageUpdate.roomId || ""] || []
          const messageIndex = roomMessages.findIndex((msg) => msg._id === messageUpdate._id)
          if (messageIndex >= 0) {
            Object.assign(roomMessages[messageIndex], messageUpdate)
          }
        }),
      updateMessageId: (tempId, message) =>
        set((state) => {
          const roomMessages = state.messages[message.room] || []
          const messageIndex = roomMessages.findIndex((msg) => msg._id === tempId)
          if (messageIndex >= 0) {
            roomMessages[messageIndex]._id = message._id
            state.pendingMessages.delete(tempId)
          }
        }),
      deleteMessage: (messageId, roomId) =>
        set((state) => {
          const roomMessages = state.messages[roomId] || []
          const messageIndex = roomMessages.findIndex((msg) => msg._id === messageId)
          if (messageIndex >= 0) {
            roomMessages[messageIndex].isDeleted = true
            roomMessages[messageIndex].content = "This message was deleted"
          }
        }),

      setMessages: (roomId, messages) =>
        set((state) => {
          state.messages[roomId] = messages
        }),

      prependMessages: (roomId, messages) =>
        set((state) => {
          const existingMessages = state.messages[roomId] || [];
          const N = 10;
          const overlapSegment = existingMessages.slice(0, N);
          const existingIds = new Set(overlapSegment.map((msg) => msg._id));
          const filteredMessages = messages.filter((msg) => !existingIds.has(msg._id));
          state.messages[roomId] = [...filteredMessages, ...existingMessages];
        }),

      setUserOnline: (userId, isOnline) =>
        set((state) => {
          if (isOnline) {
            state.onlineUsers.add(userId)
          } else {
            state.onlineUsers.delete(userId)
          }
          if (state.users[userId]) {
            state.users[userId].isOnline = isOnline
            if (!isOnline) {
              state.users[userId].lastSeen = new Date()
            }
          }
        }),

      setTyping: (typingStatus) =>
        set((state) => {
          const roomTypingUsers = state.typingUsers[typingStatus.roomId] || []
          const existingIndex = roomTypingUsers.findIndex((t) => t.userId === typingStatus.userId)

          if (existingIndex >= 0) {
            roomTypingUsers[existingIndex] = typingStatus
          } else {
            roomTypingUsers.push(typingStatus)
          }

          state.typingUsers[typingStatus.roomId] = roomTypingUsers
        }),

      removeTyping: (userId, roomId) =>
        set((state) => {
          const roomTypingUsers = state.typingUsers[roomId] || []
          state.typingUsers[roomId] = roomTypingUsers.filter((t) => t.userId !== userId)
        }),

      setMessageHistoryLoading: (roomId, isLoading) =>
        set((state) => {
          if (state.messageHistory[roomId]) {
            state.messageHistory[roomId].isLoading = isLoading
          }
        }),

      setMessageHistoryHasMore: (roomId, hasMore) =>
        set((state) => {
          if (state.messageHistory[roomId]) {
            state.messageHistory[roomId].hasMore = hasMore
          }
        }),

      incrementMessageOffset: (roomId, offset) =>
        set((state) => {
          if (state.messageHistory[roomId]) {
            state.messageHistory[roomId].offset = offset
          }
        }),

      markRoomAsRead: (roomId) =>
        set((state) => {
          const room = state.rooms[roomId]
          if (room) {
            room.unreadCount = 0
          }
        }),
      toggleSelectedUser: (userId) =>
        set((state) => {
          if (state.selectedUsers.has(userId)) {
            state.selectedUsers.delete(userId)
          } else {
            state.selectedUsers.add(userId)
          }
        }),
      clearSelectedUsers: () =>
        set((state) => {
          state.selectedUsers.clear();
        }),
      setSearchQuery: (query) =>
        set((state) => {
          state.searchQuery = query
        }),

      setConnectionStatus: (isConnected) =>
        set((state) => {
          state.isConnected = isConnected
        }),

      updateLastActivity: () =>
        set((state) => {
          state.lastActivity = new Date()
        }),

      toggleFeatureRoom: (roomId, feature) =>
        set((state) => {

          const room = state.rooms?.[roomId];
          if (!room) return;

          const toggledFields = {
            isArchived: 'isArchived',
            isPinned: 'isPinned',
            isFavourite: 'isFavourite',
          };

          const field = toggledFields[feature];
          if (!field) return;

          // ✅ Create a new room object to trigger filtering/selectors
          state.rooms[roomId] = {
            ...room,
            [field]: !room[field],
          };
        }),
      setSearchMode: (mode) =>
        set((state) => {
          state.searchMode = mode
        }),
      setSearchedUsers: ({ users, hasMore }) =>
        set((state) => {
          state.searchedUsers = {
            users: users,
            hasMore: hasMore,
            skip: 0,
          }
        }),
      appendSearchedUsers: (users, hasMore) =>
        set((state) => {
          state.searchedUsers = {
            users: [...state.searchedUsers.users, ...users],
            hasMore: hasMore,
            skip: state.searchedUsers.skip + users.length
          }
        }),
      // Helper methods
      sendMessage: (message) => {
        const { currentUser, addMessage, removeTyping, updateLastActivity } = get()
        if (!currentUser) return
        addMessage(message)
        updateLastActivity()
        removeTyping(currentUser._id, message.room)
      },

      setTypingStatus: (roomId, isTyping) => {
        const { currentUser, setTyping, removeTyping } = get()
        if (!currentUser) return

        if (isTyping) {
          setTyping({
            userId: currentUser._id,
            roomId,
            timestamp: new Date(),
          })
        } else {
          removeTyping(currentUser._id, roomId)
        }
      },

      loadMoreMessages: async (roomId) => {
        const {
          messageHistory,
          setMessageHistoryLoading,
          prependMessages,
          incrementMessageOffset,
          setMessageHistoryHasMore,
        } = get()
        const history = messageHistory[roomId]
        let offset;
        if (messageHistory[roomId].offset == 0) {
          incrementMessageOffset(roomId, Date.now())
          offset = Date.now();
        } else offset = messageHistory[roomId].offset;

        setMessageHistoryLoading(roomId, true)

        if (!history || history.isLoading || !history.hasMore) return

        // if(history.offset==0) incrementMessageOffset(roomId,Date.now())
        const { data, error } = await apiRequest({
          url: `/api/messages/${roomId}`,
          method: "GET",
          params: {
            lastTimestamp: offset,
          },
        })

        if (data.messages.length) {
          prependMessages(roomId, data.messages.map((message) => { return { ...message, sentAt: new Date(message.sentAt) } }) || [])
          incrementMessageOffset(roomId, data.messages[0].sentAt)
        }
        setMessageHistoryHasMore(roomId, !data.lastPage);
        setMessageHistoryLoading(roomId, false);

      },

      createRoom: (name, members, type) => {
        const { addRoom } = get()
        const room = {
          id: `room-${Date.now()}`,
          name,
          type,
          members,
          unreadCount: 0,
          isPinned: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        addRoom(room)
      },

      joinRoom: (roomId) => {
        const { currentUser, rooms, updateRoom } = get()
        if (!currentUser) return

        const room = rooms[roomId]
        if (room && !room.members.includes(currentUser._id)) {
          updateRoom({
            id: roomId,
            members: [...room.members, currentUser._id],
          })
        }
      },

      leaveRoom: (roomId) => {
        const { currentUser, rooms, updateRoom } = get()
        if (!currentUser) return

        const room = rooms[roomId]
        if (room && room.members.includes(currentUser._id)) {
          updateRoom({
            id: roomId,
            members: room.members.filter((id) => id !== currentUser._id),
          })
        }
      },

      // Initialize with mock data
      initializeMockData: (rooms) => {
        const { setUsers, setUserOnline } = get()

        const mockCurrentUser = {
          _id: "6865874111210ee3b73a02c0",
          fullname: "Jordan Betord",
          email: "jordan.b@uxui.com",
          profilePic: "/placeholder.svg?height=40&width=40",
          isOnline: true,
        }

        const mockUsers = [
          mockCurrentUser,
          {
            _id: "daniel-garcia",
            fullname: "Daniel Garcia",
            profilePic: "/placeholder.svg?height=40&width=40",
            isOnline: true,
          },
          {
            _id: "george-lobko",
            fullname: "George Lobko",
            profilePic: "/placeholder.svg?height=40&width=40",
            isOnline: true,
          },
          {
            _id: "amelia-korns",
            fullname: "Amelia Korns",
            profilePic: "/placeholder.svg?height=40&width=40",
            isOnline: true,
          },
          {
            _id: "monika",
            fullname: "Monika",
            profilePic: "/placeholder.svg?height=40&width=40",
            isOnline: false,
          },
        ]



        // setCurrentUser(mockCurrentUser)
        setUsers(mockUsers)
        // Set initial online users
        mockUsers.forEach((user) => {
          setUserOnline(user._id, user.isOnline)
        })
      },
    })),
  ),
)

export default useChatStore
