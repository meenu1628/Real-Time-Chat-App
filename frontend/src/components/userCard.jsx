import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useChatStore from "../stores/chatStore";

import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";

import useSocketStore from "../stores/socketStore";
import { useChatSelectors } from "../hooks/useChatSelectors";
export function UserCard({
  user,
  addRequest,
  sentRequest,
  receivedRequest,
}) {
  const {isUserSelected}=useChatSelectors()
  const handleAddUser= (userId) => {
    useChatStore.getState().toggleSelectedUser(userId);
  }
  const handleUnsend= (requestId)=>{
    useSocketStore.getState().requestUnsend(requestId);
  }
  const handleAcceptReq= (requestId) => {
    useSocketStore.getState().requestAccept(requestId);
  }
  const handleRejectReq= (requestId) => {
    useSocketStore.getState().requestReject(requestId);
  }
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors`}
    >
      <div className="flex justify-between items-center  w-full">
        <div className="flex  items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.profilePic || "/placeholder.svg"} />
            <AvatarFallback className="bg-purple-500 text-white">
              {user.fullname
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 max-w-32 ">
            <div className="flex-col items-center justify-between gap-2 ">
              <p className="font-medium text-gray-900 truncate">
                {user.fullname}
              </p>
              <p className="font-medium text-gray-400 truncate">
                {user.isGroup?"Group :"+user.groupName:"@" + user.username}
              </p>
            </div>
          </div>
        </div>
        {addRequest && (
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full border-2 border-black w-8 h-8 hover:cursor-pointer  ${isUserSelected(user._id)?
              "bg-green-400 hover:bg-green-400":"bg-blue-300  hover:bg-blue-400"
              
            } `}
            
            onClick={() => {
              handleAddUser(user._id);
            }}
          >
            {isUserSelected(user._id)?
            <Check className="w-4 h-4" />:
             <Plus className="w-4 h-4" />} 
          </Button>
        )}
        {receivedRequest && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-blue-400 hover:cursor-pointer hover:bg-blue-500"
              onClick={() => {
                handleAcceptReq(user.requestId)
              }}
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className=" bg-red-400 hover:cursor-pointer hover:bg-red-500"
              onClick={() => {
                handleRejectReq(user.requestId)
              }}
            >
              Deny
            </Button>
          </div>
        )}
        {sentRequest && (
          <Button
            variant="ghost"
            size="sm"
            className="hover:cursor-pointer bg-gray-300 hover:bg-gray-400"
            onClick={() => {
              handleUnsend(user.requestId)
            }}
          >
           Unsend
          </Button>
        )}
      </div>
    </div>
  );
}
