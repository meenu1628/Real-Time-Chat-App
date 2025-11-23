import { Button } from "../components/ui/button";
import {
  Menu,
  ArrowLeft,
  Users,
  ArchiveIcon,
  ArchiveRestore,
  Pin,
  PinOff,
  StarIcon,
  StarOff,
} from "lucide-react";
import useMobileStore from "../stores/mobileStore";
import { useChatSelectors } from "../hooks/useChatSelectors";
import useChatStore from "../stores/chatStore";
import { apiRequest } from "../lib/utils";
export function MobileHeader({ onMenuClick }) {
  const { currentView, setCurrentView } = useMobileStore();
  const { activeRoom, onlineMembers, getRoomDisplayName, totalUnreadCount } =
    useChatSelectors();

  const handleBackClick = () => {
    if (currentView === "chat") {
      useChatStore.getState().setActiveRoom("");
      setCurrentView("chat-list");
    } else if (currentView === "user-list") {
      setCurrentView("chat");
    }
  };

  const handleUsersClick = () => {
    setCurrentView("user-list");
  };

  const getTitle = () => {
    switch (currentView) {
      case "navigation":
        return "Zinkly";
      case "chat-list":
        return "Messages";
      case "chat":
        return activeRoom ? getRoomDisplayName(activeRoom) : "Chat";
      case "user-list":
        return "members";
      default:
        return "Chat";
    }
  };

  const showBackButton = currentView === "chat" || currentView === "user-list";
  const showChatActions = currentView === "chat" && activeRoom;
  const showUsersButton = currentView === "chat" && activeRoom;
  const handleClick = (feature) => {
    useChatStore.getState().toggleFeatureRoom(activeRoom._id, feature);
    apiRequest({
      url: `/api/rooms/${activeRoom._id}`,
      body: {
        [feature]: !activeRoom[feature],
      },
      method: "PATCH",
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="rounded-full"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          {currentView === "chat" && activeRoom && (
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {getRoomDisplayName(activeRoom)[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="font-semibold text-gray-900">{getTitle()}</h1>
            {currentView === "chat" && activeRoom && (
              <p className="text-xs text-green-600">
                +{onlineMembers.length} Online
              </p>
            )}
            {currentView === "chat-list" && totalUnreadCount > 0 && (
              <p className="text-xs text-gray-600">
                {totalUnreadCount} unread message
                {totalUnreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showChatActions && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleClick("isArchived")}
            >
              {activeRoom.isArchived ? (
                <ArchiveRestore className="w-4 h-4" />
              ) : (
                <ArchiveIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleClick("isFavourite")}
            >
              {activeRoom.isFavourite ? (
                <StarOff className="w-4 h-4" />
              ) : (
                <StarIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleClick("isPinned")}
            >
              {activeRoom.isPinned ? (
                <PinOff className="w-4 h-4" />
              ) : (
                <Pin className="w-4 h-4" />
              )}
            </Button>
          </>
        )}

        {showUsersButton && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleUsersClick}
          >
            <Users className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
