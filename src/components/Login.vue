<template>
    <button @click="handleClick" class="group relative inline-flex h-[200vw] w-screen items-center justify-center overflow-hidden">
        <span 
            ref="animationSpan"
            class="absolute rounded-full bg-[#052B28] ease-out flex items-center justify-center" 
            :class="isClicked ? 'w-[170vmax] h-[200vmax] transition-all duration-[2s]' : 'w-0 h-0 transition-all duration-[0.5s]'">
            <div
                id="processing_container"
                class="w-screen h-screen flex items-center justify-center"
            >
                <div class="flex items-center gap-2">
                    <span
                        class="text-4xl text-kollektif font-bold text-[#9FE29E] whitespace-nowrap overflow-hidden wipe-transition"
                        :class="showText ? 'wipe-open' : 'wipe-close'"
                    >
                        {{ dynamicText }}
                    </span>
                    <span
                        v-if="isClicked"
                        class="text-2xl text-kollektif font-bold text-[#9FE29E] flex items-center"
                    >
                        <span class="dot dot-1">.</span>
                        <span class="dot dot-2">.</span>
                        <span class="dot dot-3">.</span>
                    </span>
                </div>
            </div>
        </span>
    </button>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const isClicked = ref(false)
const showText = ref(false)
const dynamicText = ref("Video duke u procesuar")
const animationSpan = ref(null)

function disableScroll() {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
}

function enableScroll() {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
}

function scrollToCenter() {
    if (animationSpan.value) {
        const spanRect = animationSpan.value.getBoundingClientRect()
        const spanCenterY = spanRect.top + window.scrollY + (spanRect.height / 2)
        const viewportCenterY = window.innerHeight / 2
        const scrollToY = spanCenterY - viewportCenterY
        
        window.scrollTo({
            top: Math.max(0, scrollToY),
            behavior: 'smooth'
        })
    }
}

function handleClick() {
    if (!isClicked.value) {
        // Step 1: Scroll to center first
        scrollToCenter()
        
        // Step 2: Wait for scroll to complete, then start animation and disable scroll
        setTimeout(() => {
            isClicked.value = true
            disableScroll()
            
            // Show text after animation starts
            setTimeout(() => {
                showText.value = true
            }, 400)
            
            // Step 3: Re-enable scroll after animation completes (2s expansion)
            setTimeout(() => {
                enableScroll()
            }, 2000)
        }, 500) // Wait for smooth scroll to complete
        
    } else {
        showText.value = false
        disableScroll()
        
        setTimeout(() => {
            isClicked.value = false
            // Re-enable scroll after collapse animation
            setTimeout(() => {
                enableScroll()
            }, 500)
        }, 1500)
    }
}
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
    0%, 80%, 100% { transform: scale(0.8) translateY(0); opacity: 0.5; }
    40% { transform: scale(1.2) translateY(-10px); opacity: 1; }
}
</style>