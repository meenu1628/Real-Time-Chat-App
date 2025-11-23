import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Archive, Users, Mail, Star, X, LogOutIcon, Plus } from "lucide-react";
import { useChatSelectors } from "../hooks/useChatSelectors";
import useSocketStore from "../stores/socketStore";
import useChatStore from "../stores/chatStore";
import { apiRequest } from "../lib/utils";
export const NavigationLinks = ({setShowMobileNav}) => {
  const isConnected= useSocketStore((state)=>state.isConnected);
  const setMessageView = useChatStore((state) => state.setmessageView);
  const messageView=useChatStore((state) => state.messageView);
  const { totalUnreadCount } = useChatSelectors();
  const handleClick = (view) => {
   if(setShowMobileNav) setShowMobileNav(false)
    setMessageView(view);
  }
  
  return (
    <>
      <div className="p-6">
        <div className="flex items-center  gap-x-20 md:gap-x-3 gap-3">
          <div className="flex items-center justify-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-purple-900 font-bold text-lg">{import.meta.env.VITE_APP_NAME[0]}</span>
          </div>
            <span className="text-xl font-semibold">{import.meta.env.VITE_APP_NAME}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={()=>handleClick("all")}
            className="md:hidden text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          {isConnected?(
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ) :(
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${messageView=='all'? 'text-white  bg-white/10 ':'text-white/70'} hover:bg-white/10`}
            onClick={()=>handleClick("all")}
          >
            <Mail className="w-5 h-5 mr-3" />
            Messages
            {totalUnreadCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto bg-white text-purple-900"
              >
                {totalUnreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${messageView=='groups'? 'text-white  bg-white/10 ':'text-white/70'} hover:bg-white/10`}
              onClick={()=>handleClick("groups")}
          >
            <Users className="w-5 h-5 mr-3" />
            Groups
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${messageView=='favourites'? 'text-white  bg-white/10 ':'text-white/70'} hover:bg-white/10`}
            onClick={()=>handleClick("favourites")}
          >
            <Star className="w-5 h-5 mr-3" />
            Favourites
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${messageView=='archive'? 'text-white  bg-white/10 ':'text-white/70'} hover:bg-white/10`}
            onClick={()=>handleClick("archive")}
          >
            <Archive className="w-5 h-5 mr-3" />
            Archive
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${messageView=='requests'? 'text-white  bg-white/10 ':'text-white/70'} hover:bg-white/10`}
            onClick={()=>handleClick("requests")}
          >
            <Plus className="w-5 h-5 mr-3" />
            Requests
          </Button>
          
        </div>
      </nav>
    </>
  );
};

export const CurrentUserProfile = () => {
  const { currentUser } = useChatSelectors();
  const handleLogout=async ()=>{
    await apiRequest({
      url: '/api/auth/logout',
      method: 'POST',
    });
   window.location.replace("/")
  }
  return (
    <div className="flex items-center justify-between pr-3 ">
    <div className="flex items-center gap-3 p-4 border-t border-white/10 ">
      <div className="relative">
      <Avatar className="w-10 h-10">
        <AvatarImage src={currentUser.profilePic || "/placeholder.svg"} />
        <AvatarFallback className="bg-orange-500 text-white">
          {currentUser.fullname
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-purple-900"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{currentUser.fullname}</p>
        <p className="text-xs text-white/60 truncate">{currentUser.email}</p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:bg-white/10 rounded-full"
      onClick={handleLogout}>
        <LogOutIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};
