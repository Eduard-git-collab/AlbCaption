<template>
  <div 
    class="relative h-full rounded-xl shadow-[10px_10px_0px_rgba(0,0,0,0.25)] 4xl:shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)]"
    
  >

    <!-- Card -->
    <div
      class="w-full relative h-full rounded-xl z-10 border-2 border-[#353535]/70 overflow-hidden"
      :class="isRecommended ? 'rounded-tr-none' : ''"
    >
    <div
      v-if="isRecommended"
      class="absolute top-0 right-0 z-0"
    >
      <div class="bg-secondary px-3 py-1 rounded-bl-md border-[#353535]/70 border-l-2 border-b-2 border-0">
        <span class="text-primary font-poppins font-normal 4xl:text-3xl xl:text-lg lg:text-md">
          Rekomanduar
        </span>
      </div>
    </div>
      <div class="w-full h-full flex flex-col">

        <!-- ===== TOP SECTION ===== -->
        <div class="w-full h-fit py-10 border-b-2 border-[#353535]/70">
          <div class="w-full h-full px-3 flex flex-col justify-around 4xl:gap-10 xl:gap-8 lg:gap-5">
            <!-- Plan Name -->
            <h3 class="text-primary font-poppins font-semibold 4xl:text-5xl xl:text-3xl lg:text-xl my-2 mx-2">
              {{ badgeText }}
            </h3>

            <!-- Price Row -->
            <h2 class="text-primary font-poppins font-semibold 4xl:text-8xl xl:text-7xl lg:text-6xl">
              {{ currency }} {{ price }}<span class="4xl:text-5xl xl:text-4xl lg:text-3xl opacity-50">.{{ decimal }}</span>
              <span class="font-poppins font-normal 4xl:text-2xl xl:text-sm lg:text-xs">
                / {{ priceDescription }}
              </span>
            </h2>

            <!-- CTA Button -->
            <button
              @click="$emit('select', planType)"
              class="w-full h-fit px-5 4xl:py-4 lg:py-2 bg-primary text-secondary text-kollektif-bold 4xl:text-3xl text-xl 4xl:rounded-lg lg:rounded-md hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary duration-200 cursor-pointer"
            >
              Zgjidh Planin
            </button>
          </div>
        </div>

        <!-- ===== BOTTOM SECTION: Features ===== -->
        <div class="w-full flex-1">
          <div class="w-full h-full flex flex-col 4xl:py-6 xl:py-4 lg:py-2 4xl:gap-5 xl:gap-5 lg:gap-2">
            <h2 class="text-primary font-poppins font-semibold 4xl:text-4xl xl:text-3xl lg:text-xl mx-3 xl:mb-10 lg:mb-5">
              Përfshirë:
            </h2>

            <div
              v-for="(feature, i) in features"
              :key="i"
              class="w-full h-fit items-center flex flex-row"
            >
              <!-- Included -->
              <template v-if="!feature.locked">
                <div class="4xl:w-6 4xl:h-6 xl:w-5 xl:h-5 lg:w-3 lg:h-3 bg-gray-900 rounded-full mx-3 flex-shrink-0" />
                <p class="text-primary font-poppins 4xl:text-xl xl:text-lg lg:text-md">
                  {{ feature.text || feature }}
                </p>
              </template>

              <!-- Locked -->
              <template v-else>
                <div class="4xl:w-6 4xl:h-6 xl:w-5 xl:h-5 lg:w-3 lg:h-3 bg-[#D9D9D9]/25 rounded-full mx-3 flex-shrink-0" />
                <p class="font-poppins 4xl:text-xl xl:text-xl lg:text-md text-black/25">
                  {{ feature.text || feature }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  badgeText:           { type: String, default: 'PlanName' },
  badgeColor:          { type: String, default: '#052B28' },
  price:               { type: [String, Number], default: '0' },
  decimal:             { type: String, default: '00' },
  currency:            { type: String, default: '€' },
  description:         { type: String, default: '' },
  priceDescription:    { type: String, default: 'për muaj' },
  features:            { type: Array, default: () => [] },
  planType:            { type: String, default: null },
  isRecommended:       { type: Boolean, default: false },
  oldMonthlyPrice:     { type: [String, Number], default: null },
  oldDecimal:          { type: String, default: '99' },
  showOldMonthlyPrice: { type: Boolean, default: false },
  percentSaved:        { type: [String, Number], default: null },
  svgColor:            { type: String, default: '#9FE29E' }
});

defineEmits(['select']);
</script>