import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Pin,
  Search,
  MessageCircle,
  Users,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { useChatSelectors } from "../hooks/useChatSelectors";
import useChatStore from "../stores/chatStore";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner"
import { Room } from "./room";
import { useCallback, useRef } from "react";
import { apiRequest } from "../lib/utils";
import { UserCard } from "./userCard";
import { toast } from "sonner";
import useSocketStore from "../stores/socketStore";
export function ChatList() {
  const title = {
    all: "All Chats",
    favourites: "Favourite Chats",
    archive: "Archived Chats",
    groups: "Group Chats",
  };

  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const setSearchMode = useChatStore((state) => state.setSearchMode);
  const searchMode = useChatStore((state) => state.searchMode);
  const searchedUsers = useChatStore((state) => state.searchedUsers);
  const setSearchedUsers = useChatStore((state) => state.setSearchedUsers);
  const messageView = useChatStore((state) => state.messageView);
  const selectedUsers = useChatStore((state) => state.selectedUsers);
  const {
    currentUser,
    searchQuery,
    pinnedRooms,
    filteredRooms,
    receivedRequest,
    sentRequest,
  } = useChatSelectors();
  const debounceRef = useRef(null);
  const inputref=useRef(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchMode === "conversations") return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const { data, error } = await apiRequest({
        url: "/api/users/search",
        method: "GET",
        params: { q: value, skip: searchedUsers.skip || 0 },
      });

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setSearchedUsers(data);
      }
    }, 1000);
  };
  const handleSearchModeToggle = useCallback(() => {
    const newMode =
      searchMode === "conversations" ? "new-rooms" : "conversations";
    setSearchMode(newMode);
    setSearchQuery("");
  }, [searchMode, setSearchMode, searchQuery]);
    const handleCreateRoom = () => {
      if(selectedUsers.size==0) {
        toast.error("Please select at least one user to create a room." ,{
          duration: 3000,
          position: "top-center",
        });
        return;
      }else if(selectedUsers.size ==1){
        const userId = Array.from(selectedUsers)[0];
        handleSendReq([userId]);
      }else{
        const groupName = inputref.current.value.trim();
        if (!groupName) {
          toast.error("Please enter a group name.", {
            duration: 3000,
            position: "top-center",
          });
          return;
        }
        const userIds= Array.from(selectedUsers);
        handleSendReq(userIds,groupName);
      } 
    }
    const handleSendReq = (userIds,groupName) => {
    useChatStore.getState().setSearchQuery("");
    useChatStore.getState().clearSelectedUsers()
    useChatStore.getState().setSearchedUsers({ users: [], skip: 0 });
    useChatStore.getState().setSearchMode("conversations");
    useSocketStore.getState().requestSend(userIds, groupName);
  };
  if (!currentUser) return null;
  return (
    <>
    <Toaster />
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={searchMode=="new-rooms"?"Connect To New People":"Search conversations..."}
            className="pl-10 rounded-full border-gray-300"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* Mode Toggle */}
      <div className=" flex items-center justify-between">
        {/* Mode Toggle */}
        <div className="  flex items-center bg-gray-100 rounded-full p-1">
          <Button
            variant={searchMode === "conversations" ? "default" : "ghost"}
            size="sm"
            className={`  hover:cursor-pointer rounded-full px-4 py-1 text-xs transition-all ${
              searchMode === "conversations"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={handleSearchModeToggle}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chats
          </Button>
          <Button
            variant={searchMode === "new-rooms" ? "default" : "ghost"}
            size="sm"
            className={` hover:cursor-pointer rounded-full px-4 py-1 text-xs transition-all ${
              searchMode === "new-rooms"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={handleSearchModeToggle}
          >
            <Users className="w-3 h-3 mr-1" />
            Discover
          </Button>
        </div>
      </div>
      {/* New UserList*/}
      {searchMode === "new-rooms" && (
        <div className="p-4 mb-2 border-b border-gray-100">
          
          <div className="flex items-center gap-2 mb-3">
            {selectedUsers.size>1?
            <Input ref={inputref} placeholder={"Enter the Group Name"}></Input>:
            <>
            <SearchIcon className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Searched Users</h3>
            </>}
            <Button
            className={"ml-auto text-xs bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer"}
            onClick={() => {handleCreateRoom()}}
            >
              Create Room
            </Button>
          </div>
          
          <ScrollArea className="flex-1 h-96">
            <div className="space-y-2">
              {searchedUsers.users &&
                searchedUsers.users.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    sentRequest={false}
                    receivedRequest={false}
                    addRequest={true}
                  />
                ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat List */}
      {searchMode == "conversations" && messageView != "requests" && (
        <ScrollArea className="flex-1">
          {/* Pinned Chats */}
          {pinnedRooms.length > 0 && (
            <div className="p-4 mb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Pin className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Pinned Chats</h3>
              </div>
              <div className="space-y-2">
                {pinnedRooms.map((room) => (
                  <Room key={room._id} room={room} />
                ))}
              </div>
            </div>
          )}
          {/* All Chats */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                {title[messageView]}
              </h3>
            </div>
            <div className="space-y-2">
              {filteredRooms
                .filter((room) => !room.isPinned)
                .map((room) => (
                  <Room key={room._id} room={room} />
                ))}
            </div>
          </div>
        </ScrollArea>
      )}

      {searchMode == "conversations" && messageView == "requests" && (
        <>
          <div className="p-4 mb-2 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <PlusIcon className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Request Received</h3>
            </div>
            <ScrollArea className="flex-1 h-52">
              <div className="space-y-2">
                {receivedRequest &&
                  receivedRequest.map((user) => (
                    <UserCard
                      key={user.requestId}
                      user={user}
                      sentRequest={false}
                      receivedRequest={true}
                      addRequest={false}
                    />
                  ))}
              </div>
            </ScrollArea>
          </div>
          <div className="p-4 mb-2 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <PlusIcon className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Request Sent</h3>
            </div>
            <ScrollArea className="flex-1 h-48">
              <div className="space-y-2">
                {sentRequest &&
                  sentRequest.map((user) => (
                    <UserCard
                      key={user.requestId}
                      user={user}
                      sentRequest={true}
                      receivedRequest={false}
                      addRequest={false}
                    />
                  ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </>
  );
}
