import { Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useState } from "react";
import useSocketStore from "../stores/socketStore";
const MessageCard = ({
  msg,
  showDateSeparator,
  showAvatar,
  sender,
  isOwnMessage,
}) => {
  const formatTime = (date) => {
    return date
      ? date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "nothing";
  };
  const formatMessageTime = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const msgDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (msgDate.getTime() === today.getTime()) {
      return "Today";
    } else if (msgDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toDateString().slice(0, 15);
    }
  };
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div key={msg._id} className="relative group/message">
      {showDateSeparator && (
        <div className="text-center my-4 text-sm text-gray-500 font-medium">
          {formatMessageTime(msg.sentAt)}
        </div>
      )}

      <div
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start gap-3"
        }`}
      >
  

        <div
          className={`flex  ${isOwnMessage ? " justify-end" : "justify-start"}`}
        >
          <div className="flex flex-col gap-1">
            {/* Sender Name */}
            {!isOwnMessage && showAvatar && (
              <div className="flex items-center w-fit gap-2 mb-1">
              <div className="w-8">
            {showAvatar && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={sender?.profilePic || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {sender?.fullname
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "?"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
              <div className="flex items-center w-fit gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {sender?.fullname || "Unknown User"}
                </span>
              </div>
            </div>
            )}

            {/* Message bubble wrapper */}
            <div
              className={`relative rounded-2xl px-4 py-2 max-w-md cursor-pointer ${
                isOwnMessage
                  ? "bg-green-200 rounded-br-md"
                  : "bg-gray-100 rounded-tl-md"
              }`}
              onClick={() => {
                setShowOptions(true);
                setTimeout(() => setShowOptions(false), 3000);
              }}
            >
              {isOwnMessage&&<div className="flex items-center">
                {/* Options (hover + click combined) */}
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2 z-10
                    transition-opacity duration-200
                    ${isOwnMessage ? "right-full mr-2" : "left-full ml-2"}
                    invisible opacity-0
                    ${!msg.isDeleted?"group-hover/message:visible group-hover/message:opacity-100":""}
                    ${
                      showOptions&&!msg.isDeleted
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }
                    
                  `}
                >
                  <div className=" flex-col items-center text-xs px-2 py-1 rounded-full shadow whitespace-nowrap border-2  border-gray-300"
                  onClick={()=>useSocketStore.getState().deleteMessage(msg._id,msg.room)}
                  >
                    <Trash className="w-4 h-5 "/>
                  </div>
                </div>
              </div>}

              {/* Message text */}
              <p
                className={`text-sm break-words max-w-[50dvw] ${
                  msg.isDeleted ? "text-gray-500 italic" : "text-gray-800"
                }`}
              >
                {msg.content}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formatTime(msg.sentAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageCard;
