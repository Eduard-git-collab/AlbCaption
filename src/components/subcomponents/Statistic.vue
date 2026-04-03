<template>
    <div ref="root" class="w-screen h-screen p-4">
      <div class="w-full h-full flex gap-3 items-center justify-start">
        <div class="w-full h-[90%]">
          <div class="relative h-full bg-primary rounded-2xl overflow-hidden"
          :class="[
            isVisible ? 'animate-swipe' : 'w-0',
          ]">
            <div
            class="h-full w-full flex flex-col items-center justify-between"
            :class="{ 'animate-text': isVisible }"
            >
              <div class="grid-overlay scale-200 absolute top-10 -right-1/4 w-full h-full"></div>
              <div></div>
  
              <!-- Speaker SVG: fades out on mute, then removed -->
              <svg
                v-if="!showContent"
                width="181"
                height="141"
                class="scale-200"
                viewBox="-20 0 181 141"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="{ muted: isMuted, 'fade-out': isMuted }"
                style="overflow: visible;"
              >
                <defs>
                  <clipPath id="speaker-body-clip">
                    <path d="M89.7829 23.9797V117.663C89.7829 126.333 79.503 130.895 73.0737 125.078L39.37 94.5841H9.99999C4.47714 94.5841 -7.62939e-06 90.1069 -7.62939e-06 84.5841V59.9327C-7.62939e-06 54.4099 4.47715 49.9327 10 49.9327H39.37L72.7457 16.8749C79.0591 10.6217 89.7829 15.0937 89.7829 23.9797Z"/>
                  </clipPath>
                  <clipPath id="speaker-outside-clip">
                    <path d="M-20 0 H161 V141 H-20 Z M89.7829 23.9797V117.663C89.7829 126.333 79.503 130.895 73.0737 125.078L39.37 94.5841H9.99999C4.47714 94.5841 -7.62939e-06 90.1069 -7.62939e-06 84.5841V59.9327C-7.62939e-06 54.4099 4.47715 49.9327 10 49.9327H39.37L72.7457 16.8749C79.0591 10.6217 89.7829 15.0937 89.7829 23.9797Z" fill-rule="evenodd"/>
                  </clipPath>
                </defs>
  
                <!-- Speaker body -->
                <path
                  d="M89.7829 23.9797V117.663C89.7829 126.333 79.503 130.895 73.0737 125.078L39.37 94.5841H9.99999C4.47714 94.5841 -7.62939e-06 90.1069 -7.62939e-06 84.5841V59.9327C-7.62939e-06 54.4099 4.47715 49.9327 10 49.9327H39.37L72.7457 16.8749C79.0591 10.6217 89.7829 15.0937 89.7829 23.9797Z"
                  fill="#9FE29E"
                />
  
                <!-- Arc 1: smallest -->
                <path class="arc arc-1" d="M110.909 83.5413C119.919 81.2276 122.314 62.9645 110.909 56.6545" stroke="#9FE29E" stroke-width="7" stroke-linecap="round"/>
                <!-- Arc 2: medium -->
                <path class="arc arc-2" d="M122.431 96.0245C139.326 91.5624 143.816 56.3407 122.431 44.1713" stroke="#9FE29E" stroke-width="7" stroke-linecap="round"/>
                <!-- Arc 3: largest -->
                <path class="arc arc-3" d="M132.994 114.269C161.151 106.667 168.635 46.6597 132.994 25.9266" stroke="#9FE29E" stroke-width="7" stroke-linecap="round"/>
  
                <!-- Slash: secondary outside speaker -->
                <line class="mute-slash" x1="135" y1="15" x2="-5" y2="130" stroke="#9FE29E"  stroke-width="7" stroke-linecap="round" clip-path="url(#speaker-outside-clip)"/>
                <!-- Slash: primary over speaker body -->
                <line class="mute-slash" x1="135" y1="15" x2="-5" y2="130" stroke="#052B28" stroke-width="7" stroke-linecap="round" clip-path="url(#speaker-body-clip)"/>
              </svg>
  
              <!-- Content: fades in after SVG is gone -->
              <div
                v-else
                class="fade-in flex flex-col items-center justify-center w-full h-full"
              >
                <div class="flex items-center">
                  <div
                    class="relative cursor-default"
                    ref="xxContainer"
                    @mousemove="onMouseMove"
                    @mouseleave="onMouseLeave"
                  >
                    <h1 class="text-secondary text-9xl p-10 z-10 -m-10 text-kollektif-bold-italic select-none">
                      69%
                    </h1>
                    <h1
                      class="text-9xl text-kollektif-bold-italic p-10 -m-10 select-none absolute inset-0 stroke-text pointer-events-none"
                      :style="strokeMaskStyle"
                      aria-hidden="true"
                    >
                      69%
                    </h1>
                  </div>
                  <h1 class="text-7xl text-kollektif-bold-italic text-secondary cursor-default select-none">
                    &nbsp;e postimeve
                  </h1>
                </div>
                <span class="text-secondary text-md max-w-3xl text-center">
                  69% e postimeve në rrjete sociale
                  shikohen me zërin e fikur. Gjasat janë që, nëse po publikon një video të pa titruar, audienca jote nuk ka për ta parë. 69% e shikuesëve ne ambjente publike ose zyra përdorin rrjete sociale me zërin e fikur.
                </span>
              </div>
  
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const root = ref(null)
  const isMuted = ref(false)
  const isVisible = ref(false)
  const showContent = ref(false)
  
  onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      observer.disconnect() // only trigger once
  
      setTimeout(() => {
        isVisible.value = true
        setTimeout(() => {
          isMuted.value = true
        setTimeout(() => {
          showContent.value = true
            }, 1500)
        },1500)
      }, 400) // ← your delay after entering view goes here
    }
  }, {
    threshold: 0.4 // fires when 40% of the component is visible
  })
  
  observer.observe(root.value)
  })
  
  const xxContainer = ref(null)
  const mousePos = ref(null)
  
  function onMouseMove(e) {
    const rect = xxContainer.value.getBoundingClientRect()
    mousePos.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    }
  }
  
  function onMouseLeave() {
    mousePos.value = null
  }
  
  const strokeMaskStyle = computed(() => {
    if (!mousePos.value) {
      return {
        '-webkit-mask-image': 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)',
        'mask-image': 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)',
        opacity: 0,
      }
    }
    const { x, y, w, h } = mousePos.value
    const px = (x / w) * 100
    const py = (y / h) * 100
    return {
      '-webkit-mask-image': `radial-gradient(circle 120px at ${px}% ${py}%, black 20%, transparent 80%)`,
      'mask-image': `radial-gradient(circle 120px at ${px}% ${py}%, black 20%, transparent 80%)`,
      opacity: 1,
    }
  })
  </script>
  
  <style>
  /* ── existing animations ───────────────────────────────────���────────────── */
  @keyframes swipe {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes revealText {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .animate-swipe  { animation: swipe 0.8s ease-out; transform-origin: left; }
  .animate-text   { opacity: 0; animation: revealText 0.4s ease-out 0.5s forwards; }
  .animate-behind { animation: swipe 0.8s ease-out; transform-origin: left; animation-delay: 0.5s; }
  
  .grid-overlay {
    background-image:
      repeating-linear-gradient(0deg,  transparent, transparent 15px, #9FE29E 15px, #9FE29E 15.5px),
      repeating-linear-gradient(90deg, transparent, transparent 15px, #9FE29E 15px, #9FE29E 15.5px);
    opacity: 0.3;
    rotate: 20deg;
    mask-image: radial-gradient(ellipse 90% 100% at right center, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 90% 100% at right center, black 30%, transparent 100%);
  }
  .stroke-text {
    color: transparent;
    -webkit-text-stroke: 6px var(--color-secondary, #9FE29E);
    transition: opacity 0.15s ease;
  }
  
  /* ── Arc defaults ────────────────────────────────────────────────────────── */
  .arc { transition: stroke-dashoffset 0.35s ease, opacity 0.25s ease; }
  
  .arc-1 { stroke-dasharray: 30;  stroke-dashoffset: 0; opacity: 1; }
  .arc-2 { stroke-dasharray: 65;  stroke-dashoffset: 0; opacity: 1; }
  .arc-3 { stroke-dasharray: 120; stroke-dashoffset: 0; opacity: 1; }
  
  .muted .arc-1 { stroke-dashoffset: 30;  opacity: 0; transition-delay: 0s;    }
  .muted .arc-2 { stroke-dashoffset: 65;  opacity: 0; transition-delay: 0.18s; }
  .muted .arc-3 { stroke-dashoffset: 120; opacity: 0; transition-delay: 0.36s; }
  
  /* ── Slash ───────────────────────────────────────────────────────────────��─ */
  .mute-slash {
    stroke-dasharray: 175;
    stroke-dashoffset: 175;
    opacity: 0;
    transition:
      stroke-dashoffset 0.4s ease 0.7s,
      opacity           0.1s ease 0.7s;
  }
  .muted .mute-slash {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  
  /* ── SVG fade out: starts after slash finishes drawing (~1.1s total) ─────── */
  @keyframes fadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  .fade-out {
    animation: fadeOut 0.4s ease 1.1s forwards;
  }
  
  /* ── Content fade in ─────────────────────────────────────────────────────── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  </style>