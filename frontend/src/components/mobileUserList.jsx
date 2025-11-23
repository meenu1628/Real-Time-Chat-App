import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ScrollArea } from "../components/ui/scroll-area"
import { Badge } from "../components/ui/badge"
import { useChatSelectors } from "../hooks/useChatSelectors"

export function MobileUserList() {
  const { activeRoomMembers, onlineMembers, isUserOnline } = useChatSelectors()
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Online Users */}
      {onlineMembers.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-900">Online ({onlineMembers.length})</h3>
          </div>
          <ScrollArea className="max-h-52 " >
      
            {onlineMembers.map((user) => (
              <div key={user._id} className="flex items-center gap-3 py-2">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profilePic || "/placeholder.svg"} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center  gap-5">
                  <p className="font-medium text-gray-900 max-w-1/2 truncate">{user.fullname}</p>
                  <p className="font-medium text-gray-400 max-w-1/2">{"@"+user.username}</p>
                  </div>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
            ))}
      
            </ScrollArea>
        </div>
      )}

      {/* All members */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">All members ({activeRoomMembers.length})</h3>
        <ScrollArea className="max-h-52 " >
          {activeRoomMembers.map((user) => (
            <div key={user._id} className="flex items-center gap-3 py-2">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profilePic || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isUserOnline(user._id) && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center  gap-5">
                  <p className="font-medium text-gray-900 max-w-1/2 truncate">{user.fullname}</p>
                  <p className="font-medium text-gray-400 max-w-1/2">{"@"+user.username}</p>
                  </div>
                <p className="text-sm text-gray-600">{isUserOnline(user._id) ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
