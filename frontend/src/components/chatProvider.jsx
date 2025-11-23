import { use, useEffect } from "react";
import useChatStore from "../stores/chatStore";
import { apiRequest } from "../lib/utils";
import useSocketStore from "../stores/socketStore";
export function ChatProvider({ children }) {
  const setConnectionStatus = useChatStore(
    (state) => state.setConnectionStatus
  );
  const currentUser = useChatStore((state) => state.currentUser);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const removeTyping = useChatStore((state) => state.removeTyping);
  const isConnected = useSocketStore((state) => state.isConnected);
  const connect = useSocketStore((state) => state.connect);
const onlineUsers = useChatStore((state) => state.onlineUsers);



  useEffect(() => {
    if (currentUser) {
      connect(currentUser).then(() => {
        initializeData();
      });
    } else {
      console.warn("No current user found, skipping socket connection");
    }
  }, [currentUser, connect]);


  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected, setConnectionStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      Object.entries(typingUsers).forEach(([roomId, typingUsersList]) => {
        typingUsersList.forEach((typing) => {
          if (now.getTime() - typing.timestamp.getTime() > 3000) {
            removeTyping(typing.userId, roomId);
          }
        });
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [typingUsers, removeTyping]);

  return children;
}

const initializeData = () => {
  const user = useChatStore.getState().currentUser;
  const setUserOnline = useChatStore.getState().setUserOnline;
  if (!user) {
    console.warn("No user found, skipping data initialization");
    return;
  }
  // setUserOnline(user._id,true);
  apiRequest({
    url: "/api/rooms",
    method: "GET",
  }).then(({ data, error }) => {
    if (error) {
      console.error("Error fetching rooms:", error);
      return;
    }
    useChatStore.getState().setRooms(data.rooms);
    data.rooms.forEach((room)=>{
      room.members.forEach((member)=>{
        setUserOnline(member._id,member.isOnline);
      })
    })
  });
  apiRequest({
    url:"/api/users/requests",
    method:"GET",
  }).then(({data,error})=>{
    if(error){
      console.error("Error fetching requests:",error);
      return;
    }
    const {requests}=data
    useChatStore.getState().setReceivedRequest(requests.receivedRequest);
    useChatStore.getState().setSentRequest(requests.sentRequest);
  })
};
