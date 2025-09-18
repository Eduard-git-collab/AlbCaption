<template>
    <div 
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
        <span 
            class="absolute rounded-full bg-primary ease-out flex items-center justify-center" 
            :class="isActive ? 'w-[170vmax] h-[200vmax] transition-all duration-[2s]' : 'w-0 h-0 transition-all duration-[0.5s]'">
            <div
                id="processing_container"
                class="w-screen h-screen flex items-center justify-center"
            >
                <div class="flex items-center gap-2">
                    <span
                        class="text-4xl text-kollektif font-bold text-secondary whitespace-nowrap overflow-hidden wipe-transition"
                        :class="showText ? 'wipe-open' : 'wipe-close'"
                    >
                        {{ dynamicText }}
                    </span>
                    <span
                        v-if="isActive"
                        class="text-2xl text-kollektif font-bold text-secondary flex items-center"
                    >
                        <span class="dot dot-1">.</span>
                        <span class="dot dot-2">.</span>
                        <span class="dot dot-3">.</span>
                    </span>
                </div>
            </div>
        </span>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    processingText: {
        type: String,
        default: "Video duke u procesuar"
    }
})

// Local state
const isVisible = ref(false)
const showText = ref(false)
const dynamicText = ref(props.processingText)

// Watch for changes in props
watch(() => props.isActive, (newValue) => {
    if (newValue) {
        // Start animation
        isVisible.value = true
        setTimeout(() => {
            showText.value = true
        }, 400)
    } else {
        // Stop animation
        showText.value = false
        setTimeout(() => {
            isVisible.value = false
        }, 1500)
    }
})

watch(() => props.processingText, (newText) => {
    dynamicText.value = newText
})
</script>

<style scoped>
.wipe-transition {
    transition: max-width 0.7s cubic-bezier(.4,0,.2,1), opacity 0.4s;
    display: inline-block;
    vertical-align: middle;
}

.wipe-open {
    max-width: 50vw; 
    opacity: 1;
}

.wipe-close {
    max-width: 0;
    opacity: 0.5;
}

.dot {
    animation: bounce 1.4s infinite ease-in-out;
    font-size: 3rem;
    line-height: 1;
}

.dot-1 { animation-delay: -0.32s; }
.dot-2 { animation-delay: -0.16s; }
.dot-3 { animation-delay: 0s; }

@keyframes bounce {
    0%, 80%, 100% { 
        transform: scale(0.8) translateY(0); 
        opacity: 0.5; 
    }
    40% { 
        transform: scale(1.2) translateY(-10px); 
        opacity: 1; 
    }
}
</style>