<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // Content props
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  
  // Appearance props
  icon: {
    type: String,
    default: null, // 'warning', 'error', 'success', 'info', or null for no icon
    validator: (value) => [null, 'warning', 'error', 'success', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Behavior props
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  
  // Button props
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'success', 'warning'].includes(value)
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

// Animation state
const isVisible = ref(false)
const isAnimating = ref(false)

// Start show animation when component mounts
setTimeout(() => {
  isVisible.value = true
}, 10)

// Computed styles
const modalSizeClasses = computed(() => {
  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  }
  return sizes[props.size]
})

const iconConfig = computed(() => {
  const configs = {
    warning: {
      bgClass: 'bg-yellow-100',
      iconClass: 'text-yellow-600',
      path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
    },
    error: {
      bgClass: 'bg-red-100',
      iconClass: 'text-red-600',
      path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
    },
    success: {
      bgClass: 'bg-green-100',
      iconClass: 'text-green-600',
      path: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    info: {
      bgClass: 'bg-[#052B28]',
      iconClass: 'text-[#9FE29E]',
      path: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    }
  }
  return configs[props.icon] || null
})

const confirmButtonClasses = computed(() => {
  const variants = {
    primary: 'bg-[#052B28] hover:bg-[#9FE29E] text-white hover:text-[#052B28]',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    success: 'bg-green-600 hover:bg-green-500 text-white ',
    warning: 'bg-yellow-600 hover:bg-yellow-500 text-white '
  }
  return `inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs sm:ml-3 sm:w-auto transition-all duration-300 cursor-pointer ${variants[props.confirmVariant]}`
})

// Event handlers
const closeModal = async () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  isVisible.value = false
  
  // Wait for animation to complete
  setTimeout(() => {
    emit('close')
  }, 300)
}

const handleConfirm = () => {
  emit('confirm')
  closeModal()
}

const handleCancel = () => {
  emit('cancel')
  closeModal()
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal()
  }
}


const handleModalClick = (event) => {
  // Prevent backdrop click when clicking inside modal
  event.stopPropagation()
}
</script>

<template>
  <div 
    class="relative z-50" 
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true"
  >
    <!-- Backdrop with fade animation -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-show="isVisible"
        class="fixed inset-0 bg-black/50" 
        aria-hidden="true"
        @click="handleBackdropClick"
      />
    </Transition>

    <!-- Modal container -->
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Modal with scale and fade animation -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
        >
          <div 
            v-show="isVisible"
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full"
            :class="modalSizeClasses"
            @click="handleModalClick"
          >
            <!-- Header -->
            <div v-if="showHeader && (title || message || icon)" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <!-- Icon -->
                <div 
                  v-if="icon && iconConfig" 
                  class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
                  :class="iconConfig.bgClass"
                >
                  <svg 
                    class="size-6" 
                    :class="iconConfig.iconClass"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      :d="iconConfig.path" 
                    />
                  </svg>
                </div>

                <!-- Content -->
                <div class="mt-3 text-center sm:mt-0 sm:text-left" :class="{ 'sm:ml-4': icon }">
                  <h3 v-if="title" class="text-base font-semibold text-gray-900" id="modal-title">
                    {{ title }}
                  </h3>
                  <div v-if="message" class="mt-2">
                    <p class="text-sm text-gray-500">{{ message }}</p>
                  </div>
                  
                  <!-- Custom content slot -->
                  <slot name="content" />
                </div>
              </div>
            </div>

            <!-- Body slot for custom content -->
            <div v-if="$slots.body" class="px-4 py-3 sm:px-6">
              <slot name="body" />
            </div>

            <!-- Footer -->
            <div v-if="showFooter" class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <slot name="footer" :confirm="handleConfirm" :cancel="handleCancel" :close="closeModal">
                <button 
                  type="button" 
                  :class="confirmButtonClasses"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </button>
                <button 
                  type="button" 
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>