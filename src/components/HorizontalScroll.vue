<!-- HorizontalScroll Component -->

<template>
  <section ref="pinSection" class="relative bg-white text-black lg:block hidden">
    <div ref="viewport" class="h-screen relative w-screen overflow-hidden">
      <div
        ref="wideContent"
        class="w-full h-screen flex items-center relative whitespace-nowrap will-change-transform px-16"
      >
      <div class="absolute z-10 w-full h-full">
        <Albcaption_logo_nobg class="4xl:w-350 2xl:w-250 xl:w-200 lg:w-150 h-auto rounded-2xl 2xl:translate-y-[80%] translate-y-[70%] left-[70%] absolute z-10 opacity-45"/>
      </div>
      <div class="absolute z-10 w-full h-full">
        <img src="../assets/images/BentoCurves.png" class="4xl:w-350 2xl:w-250 xl:w-200 lg:w-150 h-auto rounded-2xl -translate-y-[30%] 2xl:left-[280%] xl:left-[300%] lg:left-[180%] absolute z-10 opacity-45"/>
      </div>
        <h2
          class="relative items-center 4xl:text-[600px] 2xl:text-[400px] xl:text-[300px] lg:text-[170px] font-black text-primary text-kollektif-bold leading-none z-20"
        >
          Nga regjistrimi në publikim
          <span class="4xl:text-[700px] 2xl:text-[500px] xl:text-[350px] lg:text-[200px] text-secondary text-kollektif-bold-italic">
            8x
          </span>
          më shpejtë
        </h2>

        <div class="shrink-0 w-[20vw]"></div>

        <div ref="cream" class="w-[90vw] h-full relative rounded-3xl shrink-0">
          <div
            class="w-full h-full relative flex flex-col 4xl:gap-30 2xl:gap-20 xl:gap-15 lg:gap-8 items-center justify-center p-10"
          >
            <h3
              class="4xl:text-[90px] 2xl:text-[70px] xl:text-[50px] lg:text-[30px] z-10 w-full text-center whitespace-normal font-poppins font-light leading-tight"
            >
              Të titrosh video manualisht do të thotë të harxhosh gjysmën e ditës duke shkruar dhe gjysmën tjetër duke
              sinkronizuar. Përqëndrohu tek biznesi yt, shpenzo më pak kohë te montazhi duke titruar automatikisht IA.
            </h3>

            <div class="absolute z-0 w-full h-full -translate-y-1/4 translate-x-1/4 grid-overlay-wide"></div>

            <div class="w-full flex z-10 flex-row items-center gap-10 justify-center">
              <RouterLink
                to="/signup"
                class="4xl:text-[48px] 2xl:text-[36px] xl:text-2xl text-primary bg-secondary 4xl:px-12 4xl:py-4 4xl:rounded-xl xl:px-6 xl:py-3 px-3 py-2 rounded-md
                       text-kollektif-bold text-xl hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary duration-200"
              >
                Titro 8x më Shpejtë
              </RouterLink>

              <div class="w-fit h-fit flex flex-row items-center 4xl:gap-5 2xl:gap-3 gap-2">
                <card class="4xl:w-14 4xl:h-14 2xl:w-10 2xl:h-10 xl:w-9 xl:h-9 lg:w-6 lg:h-6 text-primary" />
                <span class="4xl:text-[48px] 2xl:text-[36px] xl:text-2xl lg:text-xl">Pa kartë krediti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="lg:hidden block">
    <div class="w-screen h-[20vh]"></div>
    <div ref="sectionEl" class="relative h-screen overflow-hidden">
      <div
        ref="contentEl"
        class="absolute left-0 w-full h-[85vh] bg-primary flex flex-col items-center justify-center text-secondary"
        style="top: 15vh; transform: translateY(-100%);"
      >
        <div class="flex flex-col items-center text-center gap-3 text-4xl text-kollektif-bold">
          <p>
            Në publikim<br>
            8x më shpejtë
          </p>
          <span class="font-poppins font-medium text-sm px-3 text-center">
            Të titrosh video manualisht do të thotë të harxhosh gjysmën e ditës duke shkruar dhe gjysmën tjetër duke sinkronizuar. Përqëndrohu tek biznesi yt, shpenzo më pak kohë te montazhi duke titruar automatikisht IA.
          </span>
        </div>
        <div class="flex flex-col gap-3 w-full h-fit my-5">
          <div class="w-fit h-fit font-poppins font-bold px-5 py-2 bg-secondary text-lg text-primary hover:bg-primary hover:text-secondary hover:ring-2 hover:ring-secondary rounded-md duration-200 mx-auto">
            Titro 8x më Shpejtë
          </div>
          <div class="w-fit h-fit flex flex-row items-center gap-2 mx-auto">
            <card class="w-6 h-6 text-secondary" />
            <span class="text-lg">Pa kartë krediti</span>
          </div>
        </div>
      </div>

      <div class="absolute top-0 left-0 w-full h-[15vh] z-10 overflow-hidden bg-white flex items-center justify-center">
        <span class="text-4xl text-kollektif-bold z-10 text-primary">Nga regjistrimi</span>

        <div
          ref="squareEl"
          class="absolute w-16 h-16 z-0"
          style="bottom: 20px; left: calc(50% - 32px);"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102" fill="none">
            <g opacity="0.7">
              <circle cx="51.5" cy="51.5" r="26.5" fill="#FF5E5E" fill-opacity="0.74"/>
              <path d="M102 51C102 79.1665 79.1665 102 51 102C22.8335 102 0 79.1665 0 51C0 22.8335 22.8335 0 51 0C79.1665 0 102 22.8335 102 51ZM9.48279 51C9.48279 73.9293 28.0707 92.5172 51 92.5172C73.9293 92.5172 92.5172 73.9293 92.5172 51C92.5172 28.0707 73.9293 9.48279 51 9.48279C28.0707 9.48279 9.48279 28.0707 9.48279 51Z" fill="#FFC7C7"/>
            </g>
          </svg>
        </div>
      </div>

      <div
        ref="circleEl"
        class="absolute w-10 h-10 z-0"
        style="top: calc(15vh - 60px); left: calc(50% - 20px);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 47" fill="none">
          <path opacity="0.53" d="M21.9142 0.585786C21.1332 -0.195262 19.8668 -0.195262 19.0858 0.585787L6.35787 13.3137C5.57682 14.0948 5.57682 15.3611 6.35787 16.1421C7.13891 16.9232 8.40524 16.9232 9.18629 16.1421L20.5 4.82843L31.8137 16.1421C32.5948 16.9232 33.8611 16.9232 34.6421 16.1421C35.4232 15.3611 35.4232 14.0948 34.6421 13.3137L21.9142 0.585786ZM18.5 36C18.5 37.1046 19.3954 38 20.5 38C21.6046 38 22.5 37.1046 22.5 36L20.5 36L18.5 36ZM20.5 2L18.5 2L18.5 36L20.5 36L22.5 36L22.5 2L20.5 2Z" fill="#9FE29E"/>
          <path d="M1.5 27V42C1.5 43.6569 2.84315 45 4.5 45H35.5C37.1569 45 38.5 43.6569 38.5 42V27" stroke="#9FE29E" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount, nextTick } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import card from "./logos/card.vue"
import Albcaption_logo_nobg from "./logos/Albcaption_logo_nobg.vue"

gsap.registerPlugin(ScrollTrigger)

const isHeaderHidden = inject('isHeaderHidden')

// Desktop refs
const pinSection  = ref(null)
const viewport    = ref(null)
const wideContent = ref(null)
const cream       = ref(null)

// Mobile refs
const sectionEl = ref(null)
const contentEl = ref(null)
const squareEl  = ref(null)
const circleEl  = ref(null)

// Single GSAP context owns ALL animations in this component
let ctx = null
let resizeTimer = null

function buildDesktop() {
  const elSection  = pinSection.value
  const elViewport = viewport.value
  const elWide     = wideContent.value
  const elCream    = cream.value
  if (!elSection || !elViewport || !elWide || !elCream) return

  gsap.set(elWide, { x: 0 })

  const viewportWidth = elViewport.clientWidth
  const wideRect      = elWide.getBoundingClientRect()
  const creamRect     = elCream.getBoundingClientRect()
  const totalX        = Math.round(creamRect.right - wideRect.left - viewportWidth + 80)
  if (totalX <= 0) return

  const tween = gsap.to(elWide, { x: -totalX, ease: "none", paused: true })

  ScrollTrigger.create({
    trigger: elSection,
    start: "top top",
    end: "+=" + totalX,
    pin: true,
    pinSpacing: true,
    scrub: 0.6,
    animation: tween,
    //anticipatePin: 1,
    invalidateOnRefresh: true,
    id: "desktop-wide-scroll", // named so it's easy to find in devtools
  })
}

function buildMobile() {
  const section = sectionEl.value
  const content = contentEl.value
  const square  = squareEl.value
  const circle  = circleEl.value
  if (!section || !content || !square || !circle) return

  const contentHeight = section.offsetHeight * 0.85

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=150%",
      scrub: 1,
      pin: true,
      //anticipatePin: 1,
      id: "mobile-reveal",
      onEnter:     () => { if (isHeaderHidden) isHeaderHidden.value = true  },
      onLeave:     () => { if (isHeaderHidden) isHeaderHidden.value = false },
      onEnterBack: () => { if (isHeaderHidden) isHeaderHidden.value = true  },
      onLeaveBack: () => { if (isHeaderHidden) isHeaderHidden.value = false },
    }
  })

  tl.to(content, { y: "0%",         ease: "none" }, 0)
  tl.to(square,  { y: contentHeight, ease: "none" }, 0)
  tl.to(circle,  { y: contentHeight, ease: "none" }, 0)
}

function build() {
  // Revert and recreate the entire context so no stale triggers survive
  ctx?.revert()

  ctx = gsap.context(() => {
    buildDesktop()
    buildMobile()
  })
}

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    build()
    // refresh AFTER the new triggers are registered, not before
    ScrollTrigger.refresh()
  }, 150)
}

onMounted(async () => {
  await nextTick()

  // Two rAFs are enough; three is unnecessary. fonts.ready is the real gate.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      build()
      // Defer refresh until fonts are measured — avoids a second full refresh
      // on the same frame if fonts happen to already be loaded
      document.fonts?.ready?.then(() => {
        ScrollTrigger.refresh()
      })
    })
  })

  window.addEventListener("resize", onResize, { passive: true })
})

onBeforeUnmount(() => {
  clearTimeout(resizeTimer)
  window.removeEventListener("resize", onResize)
  ctx?.revert() // kills ALL tweens and ScrollTriggers created inside ctx
})
</script>