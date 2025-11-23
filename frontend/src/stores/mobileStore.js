import { create } from "zustand"

const useMobileStore = create((set) => ({
  currentView: "chat-list", // "navigation" | "chat-list" | "chat" | "user-list"
  showNavigation: false,

  setCurrentView: (view) => set({ currentView: view }),
  setShowNavigation: (show) => set({ showNavigation: show }),
}))

export default useMobileStore
