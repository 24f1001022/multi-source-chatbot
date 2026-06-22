import { create } from "zustand";
import { fetchFiles, deleteFile, clearAllFiles, sendMessage } from "../api/chatApi";

const savedMessages =
  JSON.parse(
    localStorage.getItem("messages")
  ) || [];

const savedMode =
  localStorage.getItem("mode")
  || "hybrid";

const useChatStore = create((set, get) => ({

  messages: savedMessages,

  uploadedFiles: [], // Synced with backend

  mode: savedMode,

  sidebarOpen: false,

  isLoadingFiles: false,

  isSending: false,

  fetchFilesFromServer: async () => {
    set({ isLoadingFiles: true });
    try {
      const files = await fetchFiles();
      set({ uploadedFiles: files, isLoadingFiles: false });
    } catch (error) {
      console.error("Failed to fetch files from server:", error);
      set({ isLoadingFiles: false });
    }
  },

  addMessage: (message) =>
    set((state) => {
      const updated = [
        ...state.messages,
        message
      ];

      localStorage.setItem(
        "messages",
        JSON.stringify(updated)
      );

      return {
        messages: updated
      };
    }),

  submitMessage: async (question) => {
    if (!question.trim() || get().isSending) return;
    
    const { mode, addMessage } = get();
    
    addMessage({
      role: "user",
      content: question
    });
    
    set({ isSending: true });
    
    try {
      const response = await sendMessage(question, mode);
      addMessage({
        role: "assistant",
        content: (response.answer !== undefined && response.answer !== null && response.answer !== "") ? response.answer : (response.error ? `Error: ${response.error}` : "No response received."),
        sources: response.sources || [],
        web_results: response.web_results || [],
        mode: response.mode
      });
    } catch (error) {
      addMessage({
        role: "assistant",
        content: "Backend error. Please ensure the backend server is running."
      });
      console.error(error);
    } finally {
      set({ isSending: false });
    }
  },

  setMode: (mode) => {
    localStorage.setItem(
      "mode",
      mode
    );

    set({
      mode
    });
  },

  addFileLocal: (fileInfo) =>
    set((state) => {
      const exists = state.uploadedFiles.some(f => f.name === fileInfo.name);
      if (exists) return {};
      return {
        uploadedFiles: [...state.uploadedFiles, fileInfo]
      };
    }),

  deleteFileFromServer: async (name) => {
    try {
      await deleteFile(name);
      set((state) => ({
        uploadedFiles: state.uploadedFiles.filter((f) => f.name !== name)
      }));
    } catch (error) {
      console.error(`Failed to delete file ${name}:`, error);
    }
  },

  clearAllFilesFromServer: async () => {
    try {
      await clearAllFiles();
      set({ uploadedFiles: [] });
    } catch (error) {
      console.error("Failed to clear files:", error);
    }
  },

  clearChat: () => {
    localStorage.removeItem(
      "messages"
    );

    set({
      messages: []
    });
  },

  setMessages: (messages) => {
    localStorage.setItem(
      "messages",
      JSON.stringify(messages)
    );

    set({
      messages
    });
  },

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen:
        !state.sidebarOpen
    }))

}));

export default useChatStore;