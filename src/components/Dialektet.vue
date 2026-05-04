<template>
  <div class="w-screen h-screen" ref="root">
    <div class="w-full h-full">

      <!-- ── LG+ : horizontal side-by-side layout ─────────────────────── -->
      <div class="hidden lg:flex w-full h-full items-center justify-center relative overflow-hidden">

        <!-- Background icon layer -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <div
            v-for="item in leftItems" :key="item.id"
            class="absolute"
            :class="iconsActive ? 'svg-landed' : 'svg-offscreen-left'"
            :style="{
              top:                item.top,
              left:               item.landX,
              rotate:             item.rotation + 'deg',
              scale:              String(item.scale),
              transitionDelay:    item.delay,
              transitionDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>

          <div
            v-for="item in rightItems" :key="item.id"
            class="absolute"
            :class="iconsActive ? 'svg-landed' : 'svg-offscreen-right'"
            :style="{
              top:                item.top,
              right:              item.landX,
              rotate:             item.rotation + 'deg',
              scale:              String(item.scale),
              transitionDelay:    item.delay,
              transitionDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>
        </div>

        <!-- LEFT bars -->
        <div
          class="flex flex-row 2xl:gap-7 4xl:gap-8 xl:gap-5 lg:gap-4 h-full items-center relative z-10 px-10 shrink-0 bar-col-left"
          :class="{ 'split': phase !== 'soundwave' }"
          
        >
          <div
            v-for="(bar, i) in leftBars" :key="'bl' + i"
            class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 bg-secondary rounded-2xl bar-el"
            :style="{ height: bar.height + 'px' }"
          ></div>
        </div>

        <!-- CENTER content — always in the flex flow, invisible until revealed -->
        <div class="h-full flex flex-col items-center justify-center 4xl:gap-12 xl:gap-10 lg:gap-5 z-10 flex-1 center-content"
             :class="{ 'revealed': phase === 'revealed' }">
          <h3 class="4xl:text-[12rem] xl:text-9xl lg:text-7xl text-primary mb-5 text-kollektif-bold">Titro Çdo Dialekt</h3>
          <span class="4xl:text-6xl xl:text-4xl lg:text-2xl 4xl:w-2/3 xl:w-full 2xl:w-[80%] xl:mx-auto lg:w-2/3 font-poppins font-light text-primary text-center">
            IA kupton dhe sinkronizon automatikisht gjuhën tënde, ashtu siç ti e flet. Merr transkripte që jane deri në 98% gati për përdorim.
          </span>
        </div>

        <!-- RIGHT bars -->
        <div
          class="flex flex-row-reverse 2xl:gap-7 4xl:gap-8 xl:gap-5 lg:gap-4 h-full items-center relative z-10 px-10 shrink-0 bar-col-right"
          :class="{ 'split': phase !== 'soundwave' }"
          
        >
          <div
            v-for="(bar, i) in rightBars" :key="'br' + i"
            class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 bg-secondary rounded-2xl bar-el"
            :style="{ height: bar.height + 'px' }"
          ></div>
        </div>

      </div>

      <!-- ── BELOW LG : vertical stacked layout ───────────────────────── -->
      <div class="flex lg:hidden w-full h-full flex-col items-center justify-between relative">

        <!-- Background icon layer (vertical) -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <div
            v-for="item in topItems" :key="item.id"
            class="absolute"
            :class="iconsActive ? 'svg-landed' : 'svg-offscreen-top'"
            :style="{
              left:               item.left,
              top:                item.landY,
              rotate:             item.rotation + 'deg',
              scale:              String(item.scale),
              transitionDelay:    item.delay,
              transitionDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>

          <div
            v-for="item in bottomItems" :key="item.id"
            class="absolute"
            :class="iconsActive ? 'svg-landed' : 'svg-offscreen-bottom'"
            :style="{
              left:               item.left,
              bottom:             item.landY,
              rotate:             item.rotation + 'deg',
              scale:              String(item.scale),
              transitionDelay:    item.delay,
              transitionDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>
        </div>

        <!-- TOP bars -->
        <div
          class="flex flex-col md:gap-7 gap-5 w-full items-center relative z-10 py-10 shrink-0 bar-row-top"
          :class="{ 'split': phase !== 'soundwave' }"
          style="background: linear-gradient(to bottom, white 0%, white 30%, transparent 100%)"
        >
          <div
            v-for="(bar, i) in topBars" :key="'bt' + i"
            class="md:h-4 h-3 bg-secondary rounded-2xl bar-el-h"
            :style="{ width: bar.width + '%' }"
          ></div>
        </div>

        <!-- CENTER content -->
        <div class="w-fit flex flex-col items-center justify-center gap-5 z-10 px-5 py-10 flex-1 center-content"
             :class="{ 'revealed': phase === 'revealed' }">
          <h3 class="md:text-7xl text-5xl text-primary mb-5 text-kollektif-bold text-center">
            Titro<br><span class="text-secondary">Çdo Dialekt</span>
          </h3>
          <span class="md:text-3xl text-xl w-4/5 font-poppins font-light text-primary text-center">
            IA kupton dhe sinkronizon automatikisht gjuhën tënde, ashtu siç ti e flet. Merr transkripte që jane deri në 98% gati për përdorim.
          </span>
        </div>

        <!-- BOTTOM bars -->
        <div
          class="flex flex-col-reverse md:gap-7 gap-5 w-full items-center relative z-10 py-10 shrink-0 bar-row-bottom"
          :class="{ 'split': phase !== 'soundwave' }"
          style="background: linear-gradient(to top, white 0%, white 30%, transparent 100%)"
        >
          <div
            v-for="(bar, i) in bottomBars" :key="'bb' + i"
            class="md:h-4 h-3 bg-secondary rounded-2xl bar-el-h"
            :style="{ width: bar.width + '%' }"
          ></div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import veriSvg from './svg/veri.vue'
import jugSvg  from './svg/jug.vue'

// ─── Phase state machine ─────────────────────────────────────────────────────
// 'soundwave' → 'splitting' → 'icons' → 'revealed'
const phase = ref('soundwave')
const root = ref(null)
const iconsActive = computed(() =>
  phase.value === 'icons' || phase.value === 'revealed'
)

// ─── Bar data ────────────────────────────────────────────────────────────────
// Fixed heights that look like a natural soundwave — varied but deliberate
const LEFT_HEIGHTS  = [55, 110, 170, 35, 90, 145]
const RIGHT_HEIGHTS = [145, 90, 35, 170, 110, 55]   // mirror of left
const BASE_WIDTHS   = [22, 45, 60, 15, 38, 55]

const leftBars   = ref(LEFT_HEIGHTS.map(h => ({ height: h })))
const rightBars  = ref(RIGHT_HEIGHTS.map(h => ({ height: h })))
const topBars    = ref(BASE_WIDTHS.map(w => ({ width: w })))
const bottomBars = ref(BASE_WIDTHS.map(w => ({ width: w })))

// ─── Soundwave ───────────────────────────────────────────────────────────────
// Animate around the fixed base values so it feels alive but never jarring
let soundwaveInterval = null

function startSoundwave() {
  soundwaveInterval = setInterval(() => {
    leftBars.value.forEach((bar, i) => {
      const base = LEFT_HEIGHTS[i]
      bar.height = Math.round(base + (Math.random() - 0.5) * 50)
    })
    rightBars.value.forEach((bar, i) => {
      const base = RIGHT_HEIGHTS[i]
      bar.height = Math.round(base + (Math.random() - 0.5) * 50)
    })
    topBars.value.forEach((bar, i) => {
      const base = BASE_WIDTHS[i]
      bar.width = Math.round(base + (Math.random() - 0.5) * 18)
    })
    bottomBars.value.forEach((bar, i) => {
      const base = BASE_WIDTHS[i]
      bar.width = Math.round(base + (Math.random() - 0.5) * 18)
    })
  }, 120)
}

function stopSoundwave() {
  clearInterval(soundwaveInterval)
  soundwaveInterval = null
}

// ─── Icon items ───────────────────────────────────────────────────────────────
// Fixed positions — look organically scattered but are always identical
const svgs = [veriSvg, jugSvg]

// [top%, landX%, rotation, scale, delay, duration]
const LEFT_ICON_DEFS = [
  ['8%',  '18%',  -28, 0.65, '0ms',   '600ms'],
  ['22%', '6%',    15, 0.90, '80ms',  '720ms'],
  ['40%', '24%',  -10, 0.55, '160ms', '580ms'],
  ['57%', '10%',   22, 0.80, '240ms', '650ms'],
  ['72%', '20%',  -18, 0.70, '320ms', '700ms'],
  ['88%', '5%',    30, 0.60, '400ms', '550ms'],
]

const RIGHT_ICON_DEFS = [
  ['12%', '14%',   20, 0.70, '40ms',  '680ms'],
  ['28%', '4%',   -25, 0.85, '120ms', '600ms'],
  ['45%', '22%',   12, 0.60, '200ms', '740ms'],
  ['60%', '8%',   -15, 0.90, '280ms', '560ms'],
  ['75%', '18%',   28, 0.65, '360ms', '700ms'],
  ['90%', '3%',   -10, 0.75, '440ms', '620ms'],
]

// [left%, landY%, rotation, scale, delay, duration]
const TOP_ICON_DEFS = [
  ['8%',  '10%',  -20, 0.70, '0ms',   '650ms'],
  ['22%', '18%',   15, 0.60, '80ms',  '580ms'],
  ['40%', '6%',   -30, 0.85, '160ms', '720ms'],
  ['58%', '22%',   10, 0.65, '240ms', '600ms'],
  ['74%', '12%',  -15, 0.80, '320ms', '680ms'],
  ['88%', '20%',   25, 0.55, '400ms', '560ms'],
]

const BOTTOM_ICON_DEFS = [
  ['12%', '8%',    18, 0.65, '40ms',  '700ms'],
  ['28%', '20%',  -12, 0.80, '120ms', '620ms'],
  ['44%', '14%',   28, 0.60, '200ms', '580ms'],
  ['60%', '6%',   -22, 0.75, '280ms', '720ms'],
  ['76%', '18%',   10, 0.85, '360ms', '640ms'],
  ['90%', '10%',  -30, 0.55, '440ms', '700ms'],
]

function buildHorizontal(defs, side) {
  return defs.map(([top, landX, rotation, scale, delay, duration], i) => ({
    id: `${side}-${i}`,
    svg: svgs[i % svgs.length],
    top, landX, rotation, scale, delay, duration,
  }))
}

function buildVertical(defs, side) {
  return defs.map(([left, landY, rotation, scale, delay, duration], i) => ({
    id: `${side}-${i}`,
    svg: svgs[i % svgs.length],
    left, landY, rotation, scale, delay, duration,
  }))
}

const leftItems   = ref(buildHorizontal(LEFT_ICON_DEFS,   'l'))
const rightItems  = ref(buildHorizontal(RIGHT_ICON_DEFS,  'r'))
const topItems    = ref(buildVertical(TOP_ICON_DEFS,    't'))
const bottomItems = ref(buildVertical(BOTTOM_ICON_DEFS, 'b'))

// ─── Timers ───────────────────────────────────────────────────────────────────
const timers = []
const later  = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id) }

// ─── Sequence ─────────────────────────────────────────────────────────────────
let observer = null
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()

      phase.value = 'soundwave'
      startSoundwave()

      later(() => { phase.value = 'splitting'                    }, 2600)
      later(() => { phase.value = 'icons'                        }, 3500)
      later(() => { phase.value = 'revealed'; stopSoundwave()    }, 4200)
    },
    { threshold: 0.5 }
  )

  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  stopSoundwave()
  timers.forEach(clearTimeout)
})

</script>

<style scoped>
/* ── Bar height/width transitions ────────────────────────────────────────── */
.bar-el   { transition: height 0.1s ease; }
.bar-el-h { transition: width  0.1s ease; }

/* ── Center content — hidden until revealed ──────────────────────────────── */
.center-content {
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}
.center-content.revealed {
  opacity: 1;
  pointer-events: auto;
}

/* ── LG+ bar columns ─────────────────────────────────────────────────────── */
/*
  Both bar columns live in the normal flex row.
  During 'soundwave' they are pushed inward with translateX so they
  overlap the center. On 'split' they translate back to 0 (their
  natural flex position), revealing the center.
*/
.bar-col-left {
  transform: translateX(50vw);
  transition: transform 0.9s cubic-bezier(0.77, 0, 0.18, 1);
}
.bar-col-left.split {
  transform: translateX(0);
}

.bar-col-right {
  transform: translateX(-50vw);
  transition: transform 0.9s cubic-bezier(0.77, 0, 0.18, 1);
}
.bar-col-right.split {
  transform: translateX(0);
}

/* ── Below LG bar rows ───────────────────────────────────────────────────── */
.bar-row-top {
  transform: translateY(40vh);
  transition: transform 0.9s cubic-bezier(0.77, 0, 0.18, 1);
}
.bar-row-top.split {
  transform: translateY(0);
}

.bar-row-bottom {
  transform: translateY(-40vh);
  transition: transform 0.9s cubic-bezier(0.77, 0, 0.18, 1);
}
.bar-row-bottom.split {
  transform: translateY(0);
}

/* ── Icon fly-in ─────────────────────────────────────────────────────────── */
.svg-offscreen-left  { transform: translateX(-160px); opacity: 0; transition: none; }
.svg-offscreen-right { transform: translateX(160px);  opacity: 0; transition: none; }
.svg-offscreen-top   { transform: translateY(-160px); opacity: 0; transition: none; }
.svg-offscreen-bottom{ transform: translateY(160px);  opacity: 0; transition: none; }

.svg-landed {
  transform: translate(0, 0);
  opacity: 1;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── SVG sizing ──────────────────────────────────────────────────────────── */
.svg-offscreen-left  :deep(svg),
.svg-offscreen-right :deep(svg),
.svg-offscreen-top   :deep(svg),
.svg-offscreen-bottom :deep(svg),
.svg-landed :deep(svg) {
  width:  clamp(40px, 5vw, 100px);
  height: auto;
}
</style>