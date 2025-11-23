import { Loader, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useChatSelectors } from "../hooks/useChatSelectors";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useMessageInput } from "../hooks/useMessageInput";
import { useEffect } from "react";
import MessageCard from "./messageCard";
const ChatScrollArea = () => {
  const {
    currentUser,
    activeRoomMessages,
    typingUsersInActiveRoom,
    activeRoom,
    getUser,
  } = useChatSelectors();
  const {
    scrollRef,
    scrollToBottom,
    isLoading: isLoadingMessages,
    hasMore,
  } = useInfiniteScroll(activeRoom?._id || null);
  const { message, setMessage, sendMessage, handleKeyPress } = useMessageInput(
    activeRoom?._id || null
  );
  let lastMessageDate = null;

  useEffect(() => {
    if (activeRoomMessages.length > 0) {
      scrollToBottom();
    }
  }, [activeRoomMessages.length, scrollToBottom]);

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {isLoadingMessages && hasMore && (
          <div className="flex justify-center py-4">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        <div className="space-y-6">
          {activeRoomMessages.map((msg, index) => {
            const isOwnMessage = msg.sender === currentUser._id;
            const sender = isOwnMessage ? currentUser : getUser(msg.sender);
            const showDateSeparator =
              msg.sentAt.toDateString() !== lastMessageDate?.toDateString();
            lastMessageDate = msg.sentAt;
            const showAvatar =
              !isOwnMessage &&
              (index === 0 ||
                activeRoomMessages[index - 1].sender !== msg.sender ||
                showDateSeparator);

            return (
              <MessageCard
                key={msg._id}
                msg={msg}
                showDateSeparator={showDateSeparator}
                showAvatar={showAvatar}
                sender={sender}
                isOwnMessage={isOwnMessage}
              />
            );
          })}

          {/* Typing indicators */}
          {typingUsersInActiveRoom.length > 0 && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    typingUsersInActiveRoom[0].profilePic || "/placeholder.svg"
                  }
                />
                <AvatarFallback className="bg-purple-500 text-white">
                  {typingUsersInActiveRoom[0].fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {typingUsersInActiveRoom.length === 1
                      ? typingUsersInActiveRoom[0].fullname
                      : `${typingUsersInActiveRoom[0].fullname} and ${
                          typingUsersInActiveRoom.length - 1
                        } other${
                          typingUsersInActiveRoom.length > 2 ? "s" : ""
                        }`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 italic">
                  {typingUsersInActiveRoom.length === 1 ? "is" : "are"}{" "}
                  typing...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Message input area */}
      <div className="p-4 border-t border-gray-200/50 bg-white">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full flex-shrink-0"
          >
            <span className="text-lg">📎</span>
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              className="rounded-full border-gray-300 pr-12"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
              onClick={sendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatScrollArea;
