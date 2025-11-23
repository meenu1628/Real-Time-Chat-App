import { useEffect, useRef, useCallback } from "react"
import useChatStore from "../stores/chatStore"
import { useChatSelectors } from "./useChatSelectors"

export function useInfiniteScroll(roomId) {
  
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages)
  const { getMessageHistory } = useChatSelectors()
  const scrollRef = useRef(null)
  const isLoadingRef = useRef(false)
  
  const handleScroll = useCallback(async () => {

    if (!roomId || !scrollRef.current || isLoadingRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const history = getMessageHistory(roomId)

    // Check if scrolled to top and there are more messages to load
    if (scrollTop === 0 && history.hasMore && !history.isLoading) {
      isLoadingRef.current = true
      const previousScrollHeight = scrollHeight
      await loadMoreMessages(roomId)

      // Maintain scroll position after loading new messages
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight
          scrollRef.current.scrollTop = newScrollHeight - previousScrollHeight
        }
        isLoadingRef.current = false
      })
    }
  }, [roomId, loadMoreMessages, getMessageHistory])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll)
      return () => scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Scroll to bottom when room changes
  useEffect(() => {
    if (roomId) {
      setTimeout(scrollToBottom, 100)
    }
  }, [roomId, scrollToBottom])

  return {
    scrollRef,
    scrollToBottom,
    isLoading: roomId ? getMessageHistory(roomId).isLoading : false,
    hasMore: roomId ? getMessageHistory(roomId).hasMore : false,
  }
}
