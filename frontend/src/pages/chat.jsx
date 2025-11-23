import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Settings,
  ArchiveIcon,
  ArchiveRestore,
  MessageCircle,
  Pin,
  PinOff,
  StarIcon,
  StarOff,
  Loader2,
} from "lucide-react";
import useChatStore from "../stores/chatStore";
import useMobileStore from "../stores/mobileStore";
import ChatScrollArea from "../components/chatScrollArea";
import { useChatSelectors } from "../hooks/useChatSelectors";
import { MobileHeader } from "../components/mobileHeader";
import {
  NavigationLinks,
  CurrentUserProfile,
} from "../components/navigationPanel";
import { ChatList } from "../components/chatList";
import { MobileUserList } from "../components/mobileUserList";
import { apiRequest } from "../lib/utils";
// import { useSocketEvents } from "../hooks/useSocket";

export default function ChatApp() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  // useSocketEvents();
  // Zustand store actions
  const setActiveRoom = useChatStore((state) => state.setActiveRoom);
  const markRoomAsRead = useChatStore((state) => state.markRoomAsRead);
  // Mobile store
  const { currentView, setCurrentView } = useMobileStore();

  // Selectors
  const { currentUser, activeRoom, onlineMembers, getRoomDisplayName } = useChatSelectors();
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
  
  // Custom hooks

  // Handle URL params
  useEffect(() => {
    if (roomId && roomId !== activeRoom?._id) {
      // Only set active room if the room exists in our rooms
      const roomExists = Object.keys(useChatStore.getState().rooms).includes(
        roomId
      );
      if (roomExists) {
        setActiveRoom(roomId);
        setCurrentView("chat");
      } else {
        // If room doesn't exist, redirect to chat list
        navigate("/", { replace: true });
      }
    } else if (!roomId && activeRoom?._id) {
      // If no roomId in URL but we have an active room, clear it
      setActiveRoom(null);
      setCurrentView("chat-list");
    }
  }, [roomId, setActiveRoom, setCurrentView, navigate]);

  // Mark active room as read when messages change
  useEffect(() => {
    if (activeRoom?._id && activeRoom.unreadCount > 0) {
      markRoomAsRead(activeRoom._id);
    }
  }, [activeRoom?._id, activeRoom?.unreadCount, markRoomAsRead]);

  // Scroll to bottom when new messages arriv

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (<div className="force-mobile">
    <div className="flex h-[100dvh] bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      {/* Mobile Layout */}
      <div className="flex flex-col w-full md:hidden">
        {/* Mobile Header */}
        <div className="flex-shrink-0">
          <MobileHeader onMenuClick={() => setShowMobileNav(true)} />
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {currentView === "chat-list" && (
            <div className="flex flex-col h-full bg-white">
              <ChatList />{" "}
            </div>
          )}
          {currentView === "chat" && activeRoom && (
            <div className="flex flex-col h-full bg-white">
              <ChatScrollArea />
            </div>
          )}
          {currentView === "user-list" && <MobileUserList />}
        </div>

        {showMobileNav && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileNav(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col">
              <NavigationLinks setShowMobileNav={setShowMobileNav} />
              <CurrentUserProfile />
            </div>
          </div>
        )}
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        {/* Left Sidebar */}
        <div className="w-72 bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col">
          <NavigationLinks />
          <CurrentUserProfile />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {getRoomDisplayName(activeRoom)[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {onlineMembers.slice(0, 4).map((user) => (
                        <Avatar
                          key={user._id}
                          className="w-8 h-8 border-2 border-white"
                        >
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {user.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {onlineMembers.length > 4 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs">
                          +{onlineMembers.length - 4}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getRoomDisplayName(activeRoom)}
                      </p>
                      <p className="text-sm text-green-600">
                        +{onlineMembers.length} Online
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                </div>
              </div>

              <ChatScrollArea />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-white/90 backdrop-blur-sm border-l border-gray-200/50">
          {/* Messages Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Active Users */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {onlineMembers.slice(0, 4).map((user) => (
                  <Avatar
                    key={user._id}
                    className="w-10 h-10 border-2 border-white"
                  >
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {onlineMembers.length > 4 && (
                  <div className="w-10 h-10 bg-purple-900 text-white rounded-full border-2 border-white flex items-center justify-center text-sm font-medium">
                    +{onlineMembers.length - 4}
                  </div>
                )}
              </div>
            </div>
            <div className="flex text-xs text-gray-600 gap-4">
              {onlineMembers.slice(0, 4).map((user) => (
                <span key={user._id}>{user.fullname.split(" ")[0]}</span>
              ))}
            </div>
          </div>
          <ChatList />
        </div>
      </div>
    </div>
    </div>
  );
}
