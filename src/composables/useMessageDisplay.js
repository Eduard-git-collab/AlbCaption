import { ref, reactive } from 'vue'

// Global reactive state for messages
const messages = ref([])
let messageId = 0

// Message types with their default configurations
const messageTypes = {
  success: {
    icon: 'check-circle',
    bgClass: 'bg-green-500',
    textClass: 'text-white',
    borderClass: 'border-green-600',
    iconClass: 'text-green-100'
  },
  error: {
    icon: 'x-circle', 
    bgClass: 'bg-red-500',
    textClass: 'text-white',
    borderClass: 'border-red-600',
    iconClass: 'text-red-100'
  },
  warning: {
    icon: 'exclamation-triangle',
    bgClass: 'bg-yellow-500',
    textClass: 'text-white', 
    borderClass: 'border-yellow-600',
    iconClass: 'text-yellow-100'
  },
  info: {
    icon: 'information-circle',
    bgClass: 'bg-blue-500',
    textClass: 'text-white',
    borderClass: 'border-blue-600', 
    iconClass: 'text-blue-100'
  }
}

// Helper function to add a message
const addMessage = (text, type = 'info', duration = 5000) => {
  const id = ++messageId
  const config = messageTypes[type] || messageTypes.info
  
  const message = {
    id,
    text,
    type,
    ...config,
    timestamp: Date.now()
  }
  
  messages.value.push(message)
  
  // Auto-hide after duration
  if (duration > 0) {
    setTimeout(() => {
      removeMessage(id)
    }, duration)
  }
  
  return id
}

// Helper function to remove a message
const removeMessage = (id) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

// Helper function to clear all messages
const clearMessages = () => {
  messages.value = []
}

// Convenience functions for different message types
const showSuccess = (text, duration = 3000) => addMessage(text, 'success', duration)
const showError = (text, duration = 5000) => addMessage(text, 'error', duration)
const showWarning = (text, duration = 4000) => addMessage(text, 'warning', duration)
const showInfo = (text, duration = 4000) => addMessage(text, 'info', duration)

// Composable hook
export function useMessageDisplay() {
  return {
    messages,
    addMessage,
    removeMessage,
    clearMessages,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

// Export individual functions for direct import
export {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  clearMessages
}