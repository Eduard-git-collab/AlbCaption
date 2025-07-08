<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
    <Transition
      v-for="message in messages"
      :key="message.id"
      name="message"
      appear
    >
      <div
        :class="[
          'flex items-start p-4 rounded-lg border shadow-lg transform transition-all duration-300',
          message.bgClass,
          message.textClass,
          message.borderClass
        ]"
        role="alert"
        :aria-live="message.type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mr-3">
          <svg
            :class="['w-5 h-5', message.iconClass]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Success icon -->
            <path
              v-if="message.icon === 'check-circle'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <!-- Error icon -->
            <path
              v-else-if="message.icon === 'x-circle'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <!-- Warning icon -->
            <path
              v-else-if="message.icon === 'exclamation-triangle'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
            <!-- Info icon -->
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Message content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium break-words">
            {{ message.text }}
          </p>
        </div>

        <!-- Close button -->
        <div class="flex-shrink-0 ml-3">
          <button
            type="button"
            @click="removeMessage(message.id)"
            :class="['inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black hover:bg-opacity-10', message.iconClass]"
            :aria-label="`Dismiss ${message.type} message`"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useMessageDisplay } from '../../composables/useMessageDisplay'

const { messages, removeMessage } = useMessageDisplay()
</script>

<style scoped>
/* Message transition animations */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.message-enter-to,
.message-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .fixed {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>