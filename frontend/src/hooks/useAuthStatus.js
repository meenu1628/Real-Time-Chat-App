import { useEffect } from "react";
import { apiRequest } from "../lib/utils";
import useChatStore from "../stores/chatStore";
import { useState } from "react";
const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setCurrentUser = useChatStore((state) => state.setCurrentUser);
  useEffect(() => {
    apiRequest({
      url: "/api/auth/status",
      method: "GET",
    }).then(({ data, error }) => {
      setLoading(false);
      if (error) {
        setIsAuthenticated(false);
      } else {
        const {user} = data;
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    })
  }, []);
  return { loading, isAuthenticated };
};
export default useAuthStatus;