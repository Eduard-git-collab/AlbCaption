<template>
  <div ref="root" class="w-[150vw] -translate-x-10 bg-primary 4xl:py-6 2xl:py-4 xl:py-3 lg:py-2 py-3 rotate-5">
    <div ref="track" class="flex items-center whitespace-nowrap will-change-transform">
      <div
        v-for="n in copies"
        :key="n"
        class="flex items-center"
        aria-hidden="true"
      >
        <template v-for="(word, i) in words" :key="`${n}-${i}`">
          <div
            class="bg-secondary xl:rounded-xl rounded-md p-1 text-primary 4xl:text-[clamp(50px,8vw,120px)] 2xl:text-[clamp(40px,6vw,100px)] xl:text-[clamp(30px,4vw,70px)] text-[clamp(20px,3vw,40px)] font-bold uppercase px-4 font-poppins"
          >
            {{ word }}
          </div>

          <div
            class="w-[clamp(20px,3vw,48px)] h-[clamp(20px,3vw,48px)] p-1 bg-secondary/70 rounded-full flex items-center justify-center lg:mx-3 mx-1 shrink-0"
          >
            <Albcaption_logo_inv_nobg class="w-3/4 h-3/4 " />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import Albcaption_logo_inv_nobg from '../logos/Albcaption_logo_inv_nobg.vue'

const words = ['Ngarko', 'Gjenero', 'Redakto', 'Shkarko']

const root = ref(null)
const track = ref(null)

const copies = ref(2) // will be recalculated to whatever is needed
let tween = null

function setupMarquee() {
  if (!root.value || !track.value) return

  // Kill previous tween if any
  tween?.kill()
  tween = null

  // Reset before measuring
  gsap.set(track.value, { x: 0 })

  // We need at least 2 copies for a wrap to work,
  // but we’ll compute enough to cover the viewport.
  const rootW = root.value.clientWidth

  // Temporarily render 2 copies so we can measure 1 sequence width
  copies.value = 2

  nextTick(() => {
    // Measure width of ONE base sequence: take first child (one copy)
    const firstCopyEl = track.value.children[0]
    if (!firstCopyEl) return

    const baseW = firstCopyEl.getBoundingClientRect().width
    if (!baseW) return

    // Ensure the track is long enough (viewport + extra)
    const needed = Math.ceil((rootW * 2) / baseW) + 1
    copies.value = Math.max(2, needed)

    nextTick(() => {
      // After we updated copies, measure again (baseW stays same, but safe)
      const first = track.value.children[0]
      const width = first.getBoundingClientRect().width

      // Speed control (px per second)
      const speed = 120
      const duration = width / speed

      // Wrap from -width..0 so it’s seamless
      tween = gsap.to(track.value, {
        x: -width,
        duration,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const v = parseFloat(x)
            // wrap v into [-width, 0)
            const wrapped = ((v % -width) + -width) % -width
            return wrapped
          })
        }
      })
    })
  })
}

onMounted(async () => {
  await nextTick()
  setupMarquee()

  // Rebuild on resize (important for responsiveness)
  const onResize = () => setupMarquee()
  window.addEventListener('resize', onResize)

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })
})

onUnmounted(() => {
  tween?.kill()
})
</script>