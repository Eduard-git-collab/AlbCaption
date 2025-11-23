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
      <!-- 
        Logo Wrapper:
        - Reduced sizes: w-24 (mobile) -> w-40 (desktop)
        - Transition: Scales down slightly when finishing for a smoother exit
      -->
      <div 
        class="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 transition-transform duration-[1.5s]"
        :class="!isLoading ? 'scale-0' : 'scale-100'"
      >
        <svg viewBox="0 0 662 658" class="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
          <defs>
            <!-- MASK -->
            <mask id="logo-mask">
               <path d="M662 658H522V522.754C518.316 527.814 514.474 532.851 510.472 537.863C455.094 607.224 380.382 645.377 291.896 655.634C233.785 662.37 177.593 655.112 125.039 628.881C39.388 586.13 -8.86746 495.369 1.35454 402.504C12.3887 302.262 80.1582 226.324 174.537 203.194C210.519 194.376 246.389 194.849 282.427 202.922C291.698 204.999 294.305 208.58 291.358 218.122C280.287 253.973 269.522 289.934 259.62 326.121C256.349 338.076 248.913 334.754 241.648 333.623C191.621 325.837 143.195 362.237 137.081 412.36C130.553 465.882 164.451 509.095 220.627 518.865C330.099 537.905 432.57 466.452 448.351 356.514C464.957 240.825 382.968 153.318 288.47 138.233C248.136 131.795 209.625 137.198 172.829 154.944C168.219 157.168 163.482 160.972 159.448 153.583C139.331 116.733 119.046 79.9723 98.8838 43.295C202.674 -27.2779 408.036 -21.1039 522 133.565V5.02818e-05H662V658Z" fill="white"/>
            </mask>
            
            <!-- GRADIENT -->
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#9FE29E" />
              <stop offset="100%" stop-color="#7dd87b" />
            </linearGradient>
          </defs>
  
          <!-- BG Outline -->
          <g mask="url(#logo-mask)">
             <rect width="100%" height="100%" fill="#ffffff" opacity="0.1" />
          </g>
  
          <!-- ANIMATED WAVE -->
          <g mask="url(#logo-mask)">
            <g class="wave-lift">
               <!-- Wave Path (2x width for seamless looping) -->
               <path 
                 class="wave-flow" 
                 fill="url(#wave-gradient)" 
                 d="M 0 0 Q 165.5 40 331 0 T 662 0 T 993 0 T 1324 0 V 1000 H 0 Z"
               />
            </g>
          </g>
        </svg>
      </div>
      
      <!-- Circular Reveal Effect Background (Optional: shrinking circle bg) -->
      <div 
          class="absolute bg-primary rounded-full z-[-1] transition-all duration-[1.5s] ease-in-out"
          :class="isLoading ? 'w-[200vmax] h-[200vmax]' : 'w-0 h-0'"
      ></div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    isLoading: {
      type: Boolean,
      required: true
    }
  })
  </script>
  
  <style scoped>
  /* Vertical Fill Animation */
  .wave-lift {
    animation: lift 3.5s ease-in-out forwards; 
  }
  
  @keyframes lift {
    0% { transform: translateY(660px); }
    100% { transform: translateY(-50px); }
  }
  
  /* Horizontal Flow Animation */
  .wave-flow {
    animation: flow 2s linear infinite;
  }
  
  @keyframes flow {
    0% { transform: translateX(0); }
    100% { transform: translateX(-662px); }
  }
  </style>