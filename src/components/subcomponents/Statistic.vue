<template>
  <div ref="root" class="w-screen h-screen p-4">
    <div class="w-full h-full">
      <div class="w-full h-[90%]">
        <div class="relative h-full w-full bg-primary rounded-2xl overflow-hidden">
          <div class="grid-overlay scale-200 absolute top-10 -right-1/4 w-full h-full"></div>

          <div class="w-full h-full grid grid-rows-6 lg:grid-rows-3">
            <!-- Row 1 -->
            <div class="w-full lg:h-fit h-8 row-span-1">
              <div class="4xl:w-30 4xl:h-30 4xl:ml-20 4xl:mt-10
                          2xl:w-20 2xl:h-20 2xl:ml-14 2xl:mt-14
                          xl:w-15 xl:h-15 xl:ml-10 xl:mt-10
                          lg:w-12 lg:h-12 lg:ml-8 lg:mt-8
                          md:w-10 md:h-10 md:ml-6 md:mt-6 
                          w-8 h-8 ml-4 mt-4 opacity-50
                          ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 265" fill="none">
                  <path
                    d="M144.416 39.4567V209.935C144.416 218.605 134.136 223.167 127.707 217.35L66.3883 161.872H15.4524C9.92957 161.872 5.45241 157.395 5.45241 151.872V102.762C5.45241 97.2387 9.92957 92.7615 15.4524 92.7615H66.3883L127.379 32.3519C133.692 26.0986 144.416 30.5707 144.416 39.4567Z"
                    fill="#9FE29E"
                  />
                  <path
                    opacity="0.1"
                    d="M211.295 192.339C254.876 180.573 266.46 87.6953 211.295 55.6051"
                    stroke="#9FE29E"
                    stroke-width="7"
                    stroke-linecap="round"
                  />
                  <path
                    opacity="0.14"
                    d="M194.945 164.101C221.093 157.195 228.043 102.68 194.945 83.844"
                    stroke="#9FE29E"
                    stroke-width="7"
                    stroke-linecap="round"
                  />
                  <path
                    opacity="0.19"
                    d="M177.112 144.78C191.058 141.199 194.765 112.932 177.112 103.166"
                    stroke="#9FE29E"
                    stroke-width="7"
                    stroke-linecap="round"
                  />
                  <line
                    x1="186.924"
                    y1="257.422"
                    x2="6.99958"
                    y2="9.77799"
                    stroke="#9FE29E"
                    stroke-width="14"
                    stroke-linecap="round"
                  />
                  <line x1="159.565" y1="220.126" x2="54.9435" y2="76.1263" stroke="#052B28" stroke-width="15" />
                </svg>
              </div>
            </div>

            <!-- Row 2 -->
            <div class="w-full h-fit flex flex-col lg:flex-row gap-3 xl:gap-10 4xl:gap-20 items-center justify-center row-span-2 lg:row-span-1">
              <!-- Percent with stroke-reveal effect -->
              <div
                class="relative cursor-default"
                ref="percentContainer"
                @mousemove="onPercentMove"
                @mouseleave="onPercentLeave"
              >
                <!-- Filled text -->
                <h1
                  class="4xl:text-[600px] 2xl:text-[400px] xl:text-[300px] md:text-[200px] text-9xl text-kollektif-bold-italic text-secondary select-none p-10 -m-10 z-10 relative"
                >
                  71%
                </h1>

                <!-- Stroked overlay -->
                <h1
                  class="4xl:text-[600px] 2xl:text-[400px] xl:text-[300px] md:text-[200px] text-9xl text-kollektif-bold-italic select-none p-10 -m-10 absolute inset-0 pointer-events-none percent-stroke"
                  :style="percentStrokeMaskStyle"
                  aria-hidden="true"
                >
                  71%
                </h1>
              </div>

              <span class="text-secondary lg:text-left text-center 4xl:text-[128px] 2xl:text-8xl xl:text-7xl md:text-5xl text-2xl text-kollektif font-medium row-span-2">
                e ndjekësve të tu përdorin<br />rrjetet sociale me zërin e fikur
              </span>
            </div>

            <!-- Row 3 -->
            <div class="w-[75%] h-fit mx-auto flex items-center justify-center">
              <span class="text-secondary font-poppins lg:font-thin font-light text-center 4xl:text-[57px] 2xl:text-4xl xl:text-3xl md:text-xl text-md">
                Ti ke vetëm pak sekonda kohë ti tregosh një shikuesi të ri, që vëmendja e tyre duhet drejtuar tek ti.<br class="lg:hidden block"><br class="lg:hidden block">
                Tërhiq shikues të rinj, ktheji në ndjekës, dhe përdor titrimin automatik për ti udhëzuar vëmendjen dhe
                shikimin tek publikimet e tua.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const root = ref(null)

// Stroke reveal effect
const percentContainer = ref(null)
const percentMouse = ref(null)

function onPercentMove(e) {
  const rect = percentContainer.value.getBoundingClientRect()
  percentMouse.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    w: rect.width,
    h: rect.height,
  }
}

function onPercentLeave() {
  percentMouse.value = null
}

const percentStrokeMaskStyle = computed(() => {
  if (!percentMouse.value) {
    return {
      '-webkit-mask-image': 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)',
      maskImage: 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)',
      opacity: 0,
    }
  }

  const { x, y, w, h } = percentMouse.value
  const px = (x / w) * 100
  const py = (y / h) * 100

  return {
    '-webkit-mask-image': `radial-gradient(circle 120px at ${px}% ${py}%, black 20%, transparent 80%)`,
    maskImage: `radial-gradient(circle 120px at ${px}% ${py}%, black 20%, transparent 80%)`,
    opacity: 1,
  }
})
</script>

<style>
.percent-stroke {
  color: transparent;
  -webkit-text-stroke: 2px var(--color-secondary, #9FE29E);
  transition: opacity 0.15s ease;
}

@media (min-width: 768px) {
  .percent-stroke {
    -webkit-text-stroke: 5px var(--color-secondary, #9FE29E);
  }
}

@media (min-width: 1024px) {
  .percent-stroke {
    -webkit-text-stroke: 7px var(--color-secondary, #9FE29E);
  }
}

@media (min-width: 1440px) {
  .percent-stroke {
    -webkit-text-stroke: 8px var(--color-secondary, #9FE29E);
  }
}

@media (min-width: 2560px) {
  .percent-stroke {
    -webkit-text-stroke: 30px var(--color-secondary, #9FE29E);
  }
}
</style>