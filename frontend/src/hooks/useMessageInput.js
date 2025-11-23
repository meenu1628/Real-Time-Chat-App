import { useState, useCallback, useRef, useEffect } from "react"
import useChatStore from "../stores/chatStore"
import useSocketStore from "../stores/socketStore"
export function useMessageInput(roomId) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const sendSocketMessage = useSocketStore((state) => state.sendMessage)
  const startTyping = useSocketStore((state) => state.startTyping)
  const stopTyping = useSocketStore((state) => state.stopTyping)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const retryMessage = useChatStore((state) => state.retryMessage)
  const setTypingStatus = useChatStore((state) => state.setTypingStatus)
  const isConnected = useChatStore((state) => state.isConnected)
  const currentUser = useChatStore((state) => state.currentUser)
  const typingTimeoutRef = useRef()

  const handleInputChange = useCallback(
    (value) => {
      setMessage(value)

      if (!roomId) return

      // Handle typing indicator
      if (value.trim() && !isTyping) {
        setIsTyping(true)
        setTypingStatus(roomId, true)
        if (isConnected) {
          startTyping(roomId)
        }
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        setTypingStatus(roomId, false)
        if (isConnected) {
          stopTyping(roomId)
        }
      }, 1000)
    },
    [roomId, isTyping, setTypingStatus, isConnected, startTyping, stopTyping] // Added isConnected and startTyping,
  )

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !roomId) return
    const messageData = {
      _id: `temp-${Date.now()}`,
      content: message.trim(),
      sender: currentUser._id,
      room: roomId,
      sentAt: new Date(),
      type: 'text'
    }
    setMessage("")
    setIsTyping(false)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setTypingStatus(roomId, false)
    if (isConnected) {
      stopTyping(roomId)
    }
    try {
      sendMessage(messageData)
      if (isConnected) {
        sendSocketMessage(messageData)
      }
      else {
        // await sendMessage(messageContent, roomId, "text")
      }
    } catch (error) {
      console.error("Error sending message:", error)

    }
  }, [message, roomId, sendMessage, sendSocketMessage, setTypingStatus, isConnected, stopTyping])

  const handleRetryMessage = useCallback(
    async (tempId) => {
      await retryMessage(tempId)
      // In a real app, you'd extract the message content and resend via socket
    },
    [retryMessage],
  )

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (roomId && isTyping) {
        setTypingStatus(roomId, false)
        if (isConnected) {
          stopTyping(roomId)
        }
      }
    }
  }, [roomId, isTyping, setTypingStatus, isConnected, stopTyping])

  return {
    message,
    setMessage: handleInputChange,
    sendMessage: handleSendMessage,
    retryMessage: handleRetryMessage,
    handleKeyPress,
    isTyping,
    isConnected,
  }
}
