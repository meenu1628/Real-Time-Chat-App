import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useChatStore from "../stores/chatStore";
import { useChatSelectors } from "../hooks/useChatSelectors";
import useMobileStore from "../stores/mobileStore";
import { useNavigate } from "react-router-dom";


export function Room({ room }) {
  const setActiveRoom = useChatStore((state) => state.setActiveRoom);
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages);
  const {
    activeRoom,
    currentUser,
    getRoomDisplayName,
    getMessageHistory,
    getRoomAvatar,
    isUserOnline,
  } = useChatSelectors();
  const { setCurrentView } = useMobileStore();
  const navigate = useNavigate();
  const handleRoomSelect = (roomId) => {
    setActiveRoom(roomId);
    setCurrentView("chat");
    navigate(`/${roomId}`);
    if (getMessageHistory(roomId).offset == 0) {
      loadMoreMessages(roomId);
    }
  };
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors md:${
        activeRoom?._id === room._id ? "bg-gray-100" : ""
      }`}
      onClick={() => handleRoomSelect(room._id)}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={getRoomAvatar(room) || "/placeholder.svg"} />
          <AvatarFallback className="bg-purple-500 text-white">
            {getRoomDisplayName(room)
              .split(" ")
              .map((n) => n[0])
              .join("")
              }
            
          </AvatarFallback>
        </Avatar>
        {room.isGroup === false &&
          room.members.some(
            (id) => id !== currentUser._id && isUserOnline(id)
          ) && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-gray-900 truncate">
            {getRoomDisplayName(room)}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-500">
              {room.lastMessage
                ? formatMessageTime(room.lastMessage.sentAt)
                : ""}
            </span>
            {room.unreadCount > 0 && (
              <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {room.unreadCount > 99 ? "99+" : room.unreadCount}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 w-1/3  truncate">
          {room.lastMessage?.content || "No messages yet"}
        </p>
      </div>
    </div>
  );
}

const formatMessageTime = (date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};
