<template>
  <div class="relative w-full overflow-visible flex flex-col">

    <div class="w-full">

      <!-- ── Section 1: Centered hero-style with stat pills ── -->
      <div class="w-full min-h-screen flex flex-col items-center justify-center p-10 sm:p-20 border-b border-primary/10">
        <div class="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">

          <h1 class="font-kollektif font-bold text-primary leading-[0.92] tracking-tight text-[clamp(3.5rem,9vw,8rem)]"
              v-html="sections[0].title" />

          <div class="w-16 h-px bg-primary/20" />

          <p class="text-base sm:text-lg font-poppins text-primary/60 max-w-2xl leading-relaxed">
            {{ sections[0].body[0] }}
          </p>

          <div class="mt-4">
            <RouterLink to="/signup"
              class="inline-flex items-center gap-2 bg-primary text-secondary px-8 py-3 rounded-xl text-lg font-kollektif font-bold hover:ring-2 hover:ring-primary hover:bg-transparent hover:text-primary transition-all duration-300">
              Regjistrohu Tani
            </RouterLink>
          </div>

        </div>
      </div>

      <!-- ── Section 2: Split left text / right visual ── -->
      <div class="w-full min-h-screen flex items-center p-10 sm:p-20 border-b border-primary/10 bg-primary/[0.02]">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <!-- Left: text -->
          <div class="flex flex-col gap-6">
            <h2 class="font-kollektif font-bold text-primary leading-[0.95] tracking-tight text-[clamp(2.2rem,5vw,5rem)]"
                v-html="sections[1].title" />
            <div class="w-12 h-px bg-primary/20" />
            <p class="text-base sm:text-lg font-poppins text-primary/60 leading-relaxed">
              {{ sections[1].body[0] }}
            </p>
          </div>

          <!-- Right: decorative block -->
          <div class="relative w-full aspect-square max-w-sm lg:max-w-none mx-auto lg:mx-0 flex items-center justify-center">
            
            <!-- Background box -->
            <div class="absolute inset-8 rounded-3xl border border-primary/10 bg-primary/[0.02]" />

            <svg
            ref="graphSvg"
            xmlns="http://www.w3.org/2000/svg"
            width="246"
            height="234"
            viewBox="0 0 246 234"
            fill="none"
            class="w-2/3 h-2/3 relative z-10"
          >
            <!-- The curve -->
            <path
              ref="graphLine"
              d="M2.50024 229.426C77.5002 237.755 227.5 204.444 227.5 4.57227"
              stroke="#9FE29E"
              stroke-width="5"
              stroke-linecap="round"
            />

            <!-- Arrowhead -->
            <path
              ref="graphArrow"
              d="M211.096 18.5L227.096 2.5L243.096 18.5"
              stroke="#9FE29E"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          </div>

        </div>
      </div>

      <!-- ── Section 3: Split right text / left visual ── -->
      <div class="w-full min-h-screen flex items-center p-10 sm:p-20">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <!-- Left: decorative accuracy ring -->
          <div class="relative w-full aspect-square max-w-sm lg:max-w-none mx-auto lg:mx-0 order-2 lg:order-1">
            <svg
              ref="ringSvg"
              class="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <!-- Background track -->
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#052B28"
                stroke-opacity="0.08"
                stroke-width="3"
              />

              <!-- 98% arc — drawn on scroll -->
              <circle
                ref="ring98"
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#052B28"
                stroke-width="3"
                stroke-linecap="round"
                style="stroke-dasharray: 251.2; stroke-dashoffset: 251.2;"
              />

              <!-- 2% arc — glows to show manual edit zone -->
              <!-- starts at 98% mark (offset 246.2) and runs remaining 5 units -->
              <!-- rotated so it sits right after the 98% arc ends -->
              <circle
                ref="ring2"
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#9FE29E"
                stroke-width="3"
                stroke-linecap="round"
                style="stroke-dasharray: 5 251.2; stroke-dashoffset: -246.2; opacity: 0;"
              />
            </svg>

            <!-- Center label -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center gap-1">
              <span
                ref="ringNumber"
                class="font-kollektif font-bold text-primary leading-none"
                style="font-size: clamp(3rem, 8vw, 6rem); opacity: 0;"
              >
                <span ref="ringCount">0</span>%
              </span>
              <span class="text-xs font-poppins text-primary/50 uppercase tracking-widest">Saktësi</span>

              <!-- 2% label — fades in with glow arc -->
              <span
                ref="label2"
                class="mt-3 text-xs font-poppins text-secondary/80 uppercase tracking-widest opacity-0"
              >
                +2% me redaktim manual
              </span>
            </div>
          </div>

          <!-- Right: text -->
          <div class="flex flex-col gap-6 order-1 lg:order-2">
            <h2 class="font-kollektif font-bold text-primary leading-[0.95] tracking-tight text-[clamp(2.2rem,5vw,5rem)]"
                v-html="sections[2].title" />
            <div class="w-12 h-px bg-primary/20" />
            <div class="flex flex-col gap-4">
              <p v-for="(para, j) in sections[2].body" :key="j"
                 class="text-base sm:text-lg font-poppins text-primary/60 leading-relaxed">
                {{ para }}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Bottom Banner: right → left -->
    <div class="relative w-full -rotate-3 pointer-events-none select-none"
         style="margin-left: -5vw; width: 110vw;">
      <div class="banner-track bg-primary flex animate-scroll-rtl whitespace-nowrap">
        <BannerContent />
        <BannerContent />
        <BannerContent />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import albcaption_logo_inv_nobg from '../logos/Albcaption_logo_inv_nobg.vue'

gsap.registerPlugin(ScrollTrigger)

// ── Graph refs ────────────────────────────────────────────────────────────────
const graphSvg   = ref(null)
const graphLine  = ref(null)
const graphArrow = ref(null)

// ── Ring refs ─────────────────────────────────────────────────────────────────
const ringSvg    = ref(null)
const ring98     = ref(null)
const ring2      = ref(null)
const ringNumber = ref(null)
const ringCount  = ref(null)
const label2     = ref(null)

let graphCtx
let ringCtx

onMounted(() => {

  // ── Graph animation ──────────────────────────────────────────────────────
  graphCtx = gsap.context(() => {
    const lineLen  = graphLine.value.getTotalLength()
    const arrowLen = graphArrow.value.getTotalLength()

    gsap.set(graphLine.value,  { strokeDasharray: lineLen,  strokeDashoffset: lineLen })
    gsap.set(graphArrow.value, { strokeDasharray: arrowLen, strokeDashoffset: arrowLen })

    ScrollTrigger.create({
      trigger: graphSvg.value,
      start: 'top 75%',
      once: true,
      onEnter() {
        const tl = gsap.timeline()
        tl.to(graphLine.value,  { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
        tl.to(graphArrow.value, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      }
    })
  }, graphSvg.value)

  // ── Ring animation ───────────────────────────────────────────────────────
  ringCtx = gsap.context(() => {

    // circumference = 2π × 40 ≈ 251.2
    const circumference = 251.2
    const target98 = circumference * 0.98  // 246.2

    ScrollTrigger.create({
      trigger: ringSvg.value,
      start: 'top 75%',
      once: true,
      onEnter() {
        const tl = gsap.timeline()

        // 1. Fade in the number
        tl.to(ringNumber.value, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        })

        // 2. Count 0 → 98 and draw the arc simultaneously
        const counter = { val: 0 }
        tl.to(counter, {
          val: 98,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate() {
            ringCount.value.textContent = Math.round(counter.val)
            // strokeDashoffset: circumference (empty) → circumference - target98 (full 98%)
            const offset = circumference - (circumference * (counter.val / 100))
            ring98.value.style.strokeDashoffset = offset
          }
        }, '<')

        // 3. Hold briefly, then glow the 2% arc in
        tl.to({}, { duration: 0.3 })
        tl.to(ring2.value, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          // Pulse glow effect
          filter: 'drop-shadow(0 0 6px #9FE29E)',
        })

        // 4. Fade in the 2% label
        tl.to(label2.value, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.3')
      }
    })

  }, ringSvg.value)

})

onUnmounted(() => {
  if (graphCtx) graphCtx.revert()
  if (ringCtx)  ringCtx.revert()
})

const sections = [
  {
    title: 'Bizneset Moderne<br />Kërkojnë<br />Zgjidhje Praktike',
    body: [
      "Nëse po përpiqesh të ndërtosh një audiencë në TikTok, Instagram apo YouTube për të shitur produkte ose për të rritur ndikimin tënd, titrimi manual i videove mund të të kushtojë orë të tëra. Orë që mund t'i shpenzosh për të krijuar videon e radhës, për të rritur biznesin apo për të kontaktuar klientin tënd të ardhshëm.",
    ],
  },
  {
    title: 'Nuk ka rëndësi thelbi i videos<br />nëse askush nuk po e shikon',
    body: [
      'Audiencat nuk ndërtohen për një ditë. Suksesi në rrjetet sociale kërkon strategji dhe mjete specifike për të tërhequr vëmendjen dhe për të mbajtur audiencën të angazhuar.',
    ],
  },
  {
    title: '98% saktësi në çdo dialekt<br />nga AlbCaptions',
    body: [
      'AlbCaptions përdor një proces të automatizuar që konverton zërin në titra dhe i sinkronizon ato me videon përkatëse. Me ndihmën e Inteligjencës Artificiale, sistemi ynë realizon pjesën më të madhe të punës, duke e bërë procesin të shpejtë dhe jashtëzakonisht të saktë (deri në 98%).',
      'Për 2% që mbetet, AlbCaptions ofron mjete të integruara për redaktim manual, ku përdoruesit mund të korrigjojnë tekstin me lehtësi dhe të arrijnë rezultate 100% të sakta.',
    ],
  },
]


const BannerContent = defineComponent({
  setup() {
    const words = ['Ngarko', 'Gjenero', 'Redakto', 'Shkarko']
    return () =>
      h('div', { class: 'flex items-center bg-primary p-1' },
        words.flatMap((word) => [
          h('div', {
            class: 'bg-secondary rounded-xl p-1 text-primary text-[clamp(30px,4vw,70px)] text-kollektif-bold font-bold uppercase px-4 font-poppins'
          }, word),
          h('div', {
            class: 'w-[clamp(20px,3vw,48px)] h-[clamp(20px,3vw,48px)] bg-secondary/70 p-2 rounded-full flex items-center justify-center mx-3 shrink-0'
          }, [
            h(albcaption_logo_inv_nobg, { class: 'w-3/4 h-3/4' })
          ])
        ])
      )
  }
})
</script>

<style scoped>
@keyframes scroll-rtl {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-scroll-rtl { animation: scroll-rtl 20s linear infinite; }
</style>