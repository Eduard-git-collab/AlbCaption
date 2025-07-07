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
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-full opacity-0"
        >
            <div 
                v-show="isVisible"
                class="flex items-center justify-center min-h-screen px-4 py-6 sm:p-0"
                @click="handleBackdropClick"
            >
                <div 
                class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto"
                @click="handleModalClick"
                >
                <!-- Modal header -->
                <div class="px-4 py-3 border-b">
                    <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                    {{ title }}
                    </h3>
                </div>
    
                <!-- Modal content -->
                <div class="p-4">
                    <slot></slot>
                </div>
    
                <!-- Modal footer -->
                <div class="px-4 py-3 border-t flex justify-end space-x-2">
                    <button 
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    @click="handleCancel"
                    >
                    Cancel
                    </button>
                    <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    @click="handleConfirm"
                    >
                    Confirm
                    </button>
                </div>
                </div>
            </div>
        </Transition>
        </div>

    </div>
</template>

<script setup>
// Animation state
const isVisible = ref(false)
const isAnimating = ref(false)

// Start show animation when component mounts
setTimeout(() => {
  isVisible.value = true
}, 10)

const closeModal = async () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  isVisible.value = false
  
  // Wait for animation to complete
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>