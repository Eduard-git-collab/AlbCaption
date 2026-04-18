<template>
  <div class="w-screen h-screen">
    <div class="w-full h-full">

      <!-- ── LG+ : horizontal side-by-side layout ─────────────────────── -->
      <div class="hidden lg:flex w-full h-full items-center justify-between relative">

        <!-- Background animation layer -->
        <div class="absolute inset-x-0 overflow-y-visible -translate-y-1/8 h-2/3 z-0 px-20">

          <div
            v-for="item in leftItems" :key="item.id"
            class="absolute svg-travel-left"
            :style="{
              top:               item.top,
              rotate:            item.rotation + 'deg',
              scale:             String(item.scale),
              animationDelay:    item.delay,
              animationDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>

          <div
            v-for="item in rightItems" :key="item.id"
            class="absolute svg-travel-right"
            :style="{
              top:               item.top,
              rotate:            item.rotation + 'deg',
              scale:             String(item.scale),
              animationDelay:    item.delay,
              animationDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>

        </div>

        <!-- LEFT bars -->
        <div class="flex flex-row 2xl:gap-7 4xl:gap-8 xl:gap-5 lg:gap-4 h-full items-center relative z-10 px-10"
             style="background: linear-gradient(to right, white 0%, white 70%, transparent 100%)">
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/4 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/3 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/2 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/8 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/12 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/4 bg-secondary rounded-2xl"></div>
        </div>

        <!-- CENTER content -->
        <div class="w-fit h-full flex flex-col items-center justify-center 4xl:gap-12 xl:gap-10 lg:gap-5 z-10">
          <h3 class="4xl:text-[12rem] xl:text-9xl lg:text-7xl text-primary mb-5 text-kollektif-bold">Titro Çdo Dialekt</h3>
          <span class="4xl:text-6xl xl:text-4xl lg:text-2xl 4xl:w-2/3 xl:w-full 2xl:w-[80%] xl:mx-auto lg:w-2/3 font-poppins font-light text-primary text-center">
            IA kupton dhe sinkronizon automatikisht gjuhën tënde, ashtu siç ti e flet. Merr transkripte që jane deri në 98% gati për përdorim.
          </span>
        </div>

        <!-- RIGHT bars -->
        <div class="flex flex-row-reverse 2xl:gap-7 4xl:gap-8 xl:gap-5 lg:gap-4 h-full items-center relative z-10 px-10"
             style="background: linear-gradient(to left, white 0%, white 70%, transparent 100%)">
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/4 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/3 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/2 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/8 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/12 bg-secondary rounded-2xl"></div>
          <div class="4xl:w-7 2xl:w-6 xl:w-4 lg:w-3 h-1/4 bg-secondary rounded-2xl"></div>
        </div>

      </div>

      <!-- ── BELOW LG : vertical stacked layout ───────────────────────── -->
      <div class="flex lg:hidden w-full h-full flex-col items-center justify-between relative">

        <!-- TOP → CENTER (top bars + SVGs travelling downward) -->
        <div class="flex flex-col md:gap-7 gap-5 w-full items-center relative z-10 py-10"
             style="background: linear-gradient(to bottom, white 0%, white 30%, transparent 100%)">
          <div class="md:h-4 h-3 w-1/4 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/3 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/2 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/8 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/12 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/4 bg-secondary rounded-2xl"></div>
        </div>

        <!-- Background animation layer (vertical) -->
        <div class="absolute inset-y-0 overflow-x-visible w-2/3 overflow-y-hidden z-0 py-20">

          <!-- TOP → CENTER -->
          <div
            v-for="item in topItems" :key="item.id"
            class="absolute svg-travel-top"
            :style="{
              left:              item.left,
              rotate:            item.rotation + 'deg',
              scale:             String(item.scale),
              animationDelay:    item.delay,
              animationDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>

          <!-- BOTTOM → CENTER -->
          <div
            v-for="item in bottomItems" :key="item.id"
            class="absolute svg-travel-bottom"
            :style="{
              left:              item.left,
              rotate:            item.rotation + 'deg',
              scale:             String(item.scale),
              animationDelay:    item.delay,
              animationDuration: item.duration,
            }"
          >
            <component :is="item.svg" />
          </div>

        </div>

        <!-- CENTER content -->
        <div class="w-fit flex flex-col items-center justify-center gap-5 z-10 px-5 py-10">
          <h3 class="md:text-7xl text-5xl text-primary mb-5 text-kollektif-bold text-center">Titro<br> <span class="text-secondary"> Çdo Dialekt </span></h3>
          <span class="md:text-3xl text-xl w-4/5 font-poppins font-light text-primary text-center">
            IA kupton dhe sinkronizon automatikisht gjuhën tënde, ashtu siç ti e flet. Merr transkripte që jane deri në 98% gati për përdorim.
          </span>
        </div>

        <!-- BOTTOM → CENTER (bottom bars) -->
        <div class="flex flex-col-reverse md:gap-7 gap-5 w-full items-center relative z-10 py-10"
             style="background: linear-gradient(to top, white 0%, white 30%, transparent 100%)">
          <div class="md:h-4 h-3 w-1/4 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/3 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/2 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/8 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/12 bg-secondary rounded-2xl"></div>
          <div class="md:h-4 h-3 w-1/4 bg-secondary rounded-2xl"></div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import veriSvg from './svg/veri.vue'
import jugSvg  from './svg/jug.vue'

const ITEM_COUNT = 7
const rand = (min, max) => Math.random() * (max - min) + min
const svgs = [veriSvg, jugSvg]

// Horizontal items (lg+) — scattered on Y axis, travel along X
function makeItems(side) {
  return Array.from({ length: ITEM_COUNT }, (_, i) => ({
    id:       `${side}-${i}`,
    svg:      svgs[i % svgs.length],
    top:      `${rand(5, 88)}%`,
    rotation: rand(-40, 40),
    scale:    rand(0.5, 1.0),
    delay:    `-${(i / ITEM_COUNT) * 10}s`,
    duration: `${rand(8, 13)}s`,
  }))
}

// Vertical items (below lg) — scattered on X axis, travel along Y
function makeVerticalItems(side) {
  return Array.from({ length: ITEM_COUNT }, (_, i) => ({
    id:       `${side}-${i}`,
    svg:      svgs[i % svgs.length],
    left:     `${rand(5, 88)}%`,
    rotation: rand(-40, 40),
    scale:    rand(0.5, 1.0),
    delay:    `-${(i / ITEM_COUNT) * 10}s`,
    duration: `${rand(8, 13)}s`,
  }))
}

const leftItems   = ref(makeItems('l'))
const rightItems  = ref(makeItems('r'))
const topItems    = ref(makeVerticalItems('t'))
const bottomItems = ref(makeVerticalItems('b'))
</script>

<style scoped>
/* ── Responsive SVG size ──────────────────────────────────────────────────── */
.svg-travel-left  :deep(svg),
.svg-travel-right :deep(svg),
.svg-travel-top   :deep(svg),
.svg-travel-bottom :deep(svg) {
  width:  clamp(40px, 5vw, 100px);
  height: auto;
}

/* ── HORIZONTAL keyframes (lg+) ──────────────────────────────────────────── */
@keyframes travel-left {
  0%   { left: -120px; opacity: 0;   }
  10%  { opacity: 1;                 }
  70%  { opacity: 0.6;               }
  100% { left: 30vw;  opacity: 0;   }
}

@keyframes travel-right {
  0%   { right: -120px; opacity: 0; }
  10%  { opacity: 1;                }
  70%  { opacity: 0.6;                }
  100% { right: 30vw;  opacity: 0; }
}

.svg-travel-left {
  animation-name: travel-left;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.svg-travel-right {
  animation-name: travel-right;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

/* ── VERTICAL keyframes (below lg) ───────────────────────────────────────── */
@keyframes travel-top {
  0%   { top: -120px; opacity: 0;   }
  10%  { opacity: 1;                }
  70%  { opacity: 0.6;              }
  100% { top: 40vh;   opacity: 0;  }
}

@keyframes travel-bottom {
  0%   { bottom: -120px; opacity: 0; }
  10%  { opacity: 1;                 }
  70%  { opacity: 0.6;               }
  100% { bottom: 40vh;   opacity: 0; }
}

.svg-travel-top {
  animation-name: travel-top;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.svg-travel-bottom {
  animation-name: travel-bottom;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
</style>