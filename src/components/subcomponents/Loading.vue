<template>
    <!-- 
      Outer Container:
      - fixed inset-0: Covers screen
      - flex/justify/items-center: Keeps content perfectly centered
      - transition-all: Smoothes the exit
    -->
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-primary overflow-hidden transition-all duration-[1.5s] ease-in-out"
      :class="isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div class="w-screen h-screen flex items-center justify-center bg-primary">
      <div class="w-1/3 h-1/3 flex items-center justify-center">
        <svg
          ref="svg"
          viewBox="-10 -10 682 678"
          class="w-full h-full overflow-visible"
        >
          <path
            ref="curve"
            d="M553.159 184.302C608.87 311.22 596.577 430.016 510.472 537.863C455.094 607.224 380.383 645.376 291.896 655.634C233.785 662.369 177.593 655.111 125.039 628.88C39.3873 586.13 -8.86758 495.369 1.3546 402.504C12.3887 302.262 80.1583 226.324 174.537 203.195C210.519 194.377 246.388 194.848 282.426 202.921C291.698 204.998 294.305 208.579 291.358 218.122C280.287 253.973 269.522 289.934 259.62 326.121C256.349 338.076 248.913 334.754 241.647 333.623C191.621 325.837 143.195 362.237 137.081 412.36C130.553 465.882 164.451 509.095 220.627 518.866C330.099 537.905 432.57 466.452 448.351 356.514C464.957 240.825 382.968 153.318 288.47 138.234C248.136 131.795 209.625 137.198 172.829 154.945C168.219 157.168 163.482 160.972 159.448 153.583C139.33 116.733 119.047 79.9727 98.884 43.2953C213.018 -34.3109 449.978 -19.1118 553.159 184.302Z"
            fill="#9FE29E"
            stroke="#9FE29E"
            stroke-width="8"
          />

          <rect
            ref="rect"
            x="522"
            y="0"
            width="140"
            height="658"
            rx="10"
            fill="#9FE29E"
            stroke="#9FE29E"
            stroke-width="8"
          />
        </svg>
      </div>
    </div>
    </div>
  </template>

<script setup>
import { onMounted, ref } from "vue"
import gsap from "gsap"

defineProps({
    isLoading: {
      type: Boolean,
      required: true
    }
  })

const curve = ref(null)
const rect = ref(null)

onMounted(() => {
  const curveLength = curve.value.getTotalLength()
  const rectLength = rect.value.getTotalLength()

  // Initial state
  gsap.set([curve.value, rect.value], {
    fillOpacity: 0
  })

  gsap.set(curve.value, {
    strokeDasharray: curveLength,
    strokeDashoffset: curveLength
  })

  gsap.set(rect.value, {
    strokeDasharray: rectLength,
    strokeDashoffset: rectLength
  })

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })

  tl.to(curve.value, {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.out"
  })
    .to(rect.value, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "power2.out"
    })
    // fill after drawing
    .to([curve.value, rect.value], {
      fillOpacity: 1,
      duration: 0.5
    })
    // reset
    .to([curve.value, rect.value], {
      strokeDashoffset: (i, el) => el.getTotalLength(),
      fillOpacity: 0,
      duration: 0,
      delay: 1
    })
})
</script>