import { useMemo, useCallback } from "react";
import useChatStore from "../stores/chatStore";


export function useChatSelectors() {
  const currentUser = useChatStore((s) => s.currentUser);
  const rooms = useChatStore((s) => s.rooms);
  const messages = useChatStore((s) => s.messages);
  const users = useChatStore((s) => s.users);
  const activeRoomId = useChatStore((s) => s.activeRoomId);
  const searchQuery = useChatStore((s) => s.searchQuery);
  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const isConnected = useChatStore((s) => s.isConnected);
  const messageHistory = useChatStore((s) => s.messageHistory);
  const searchMode = useChatStore((s) => s.searchMode);
  const messageView = useChatStore((s) => s.messageView);
  const receivedReq = useChatStore((s) => s.requests.received);
  const sentReq = useChatStore((s) => s.requests.sent);
  const selectedUsers = useChatStore((s) => s.selectedUsers);

  const receivedRequest = useMemo(() => {
    return Object.values(receivedReq).sort((a, b) => {
      const aTime = a.createdAt || a.sentAt;
      const bTime = b.createdAt || b.sentAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [receivedReq]);

  const sentRequest = useMemo(() => {
    return Object.values(sentReq).sort((a, b) => {
      const aTime = a.createdAt || a.sentAt;
      const bTime = b.createdAt || b.sentAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [sentReq]);

  const sortedRooms = useMemo(() => {
    return Object.values(rooms).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = a.lastMessage?.sentAt || a.createdAt;
      const bTime = b.lastMessage?.sentAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [rooms]);

  const pinnedRooms = useMemo(
    () => sortedRooms.filter((room) => room.isPinned && !room.isArchived),
    [sortedRooms]
  );

  const allRooms = useMemo(
    () => sortedRooms.filter((room) => !room.isArchived),
    [sortedRooms]
  );

  const getRoomDisplayName = useCallback(
    (room) => {
      if (room.isGroup === false && currentUser) {
        const otherId = room.members.find((id) => id !== currentUser._id);
        return otherId ? users[otherId]?.fullname || "Unknown User" : "Unknown";
      }
      return room.groupSettings?.groupName || "Unnamed Group";
    },
    [users, currentUser]
  );

  const filteredRooms = useMemo(() => {
    if (searchMode !== "conversations" || messageView == "requests") return allRooms;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return allRooms.filter(
        (room) => (messageView != 'groups' || room.isGroup) &&
          (messageView !== 'favourites' || room.isFavourite) &&
          (messageView !== 'archive' || room.isArchived) &&
          (getRoomDisplayName(room).toLowerCase().includes(query) ||
            room.lastMessage?.content.toLowerCase().includes(query))
      );
    } else if (messageView == 'all') {
      return allRooms
    }
    else if (messageView == 'groups') {
      return allRooms.filter((room) => room.isGroup && !room.isArchived);
    }
    else if (messageView == 'favourites') {
      return allRooms.filter((room) => room.isFavourite && !room.isArchived);
    }
    else if (messageView == 'archive') {
      return sortedRooms.filter((room) => room.isArchived);
    }
  }, [allRooms, searchQuery, getRoomDisplayName, messageView]);

  const activeRoom = useMemo(() => {
    return activeRoomId ? rooms[activeRoomId] || null : null;
  }, [activeRoomId, rooms]);

  const activeRoomMessages = useMemo(() => {
    return activeRoomId ? messages[activeRoomId] || [] : [];
  }, [activeRoomId, messages]);

  const activeRoomMembers = useMemo(() => {
    if (!activeRoom) return [];
    return activeRoom.members
      .map((id) => users[id])
      .filter((user) => Boolean(user));
  }, [activeRoom, users]);

  const onlineMembers =
    useMemo(
      useCallback(() => {
        return activeRoomMembers.filter((user) => onlineUsers.has(user._id));
      })
      , [activeRoomMembers, onlineUsers]);
  const isUserSelected = useCallback(
    (userId) => selectedUsers.has(userId),
    [selectedUsers]
  );
  const typingUsersInActiveRoom = useMemo(() => {
    const typing = typingUsers[activeRoomId] || [];
    return typing
      .filter((t) => t.userId !== currentUser?._id)
      .map((t) => users[t.userId])
      .filter(Boolean);


  }, [typingUsers, users, activeRoomId, currentUser]);

  const totalUnreadCount = useMemo(() => {
    return Object.values(rooms).reduce(
      (acc, room) => acc + (room.unreadCount || 0),
      0
    );
  }, [rooms]);

  const getRoomAvatar = useCallback(
    (room) => {
      if (room.isGroup === false && currentUser) {
        const otherId = room.members.find((id) => id !== currentUser._id);
        return otherId ? users[otherId]?.profilePic : undefined;
      }
      return room.groupSettings?.groupProfilepic;
    },
    [currentUser, users]
  );

  const isUserOnline = useCallback(
    (userId) => onlineUsers.has(userId),
    [onlineUsers]
  );

  const getUser = useCallback(
    (id) => users[id] || null,
    [users]
  );

  const getMessageHistory = useCallback(
    (roomId) => messageHistory[roomId] || { hasMore: true, isLoading: false, offset: 0 },
    [messageHistory]
  );

  return {
    currentUser,
    isConnected,
    searchQuery,
    sortedRooms,
    pinnedRooms,
    allRooms,
    filteredRooms,
    activeRoom,
    totalUnreadCount,
    activeRoomMessages,
    activeRoomMembers,
    onlineMembers,
    typingUsersInActiveRoom,
    sentRequest,
    receivedRequest,
    getRoomDisplayName,
    getRoomAvatar,
    getUser,
    isUserOnline,
    isUserSelected,
    getMessageHistory,
  };
}
