<template>
  <div class="relative w-full rounded-xl border border-[#353535]/40 bg-white shadow-md">

    <!-- Recommended Badge -->
    <div v-if="isRecommended" class="absolute -top-3 left-1/2 -translate-x-1/2">
      <div class="bg-secondary px-4 py-1 rounded-full">
        <span class="text-primary text-xs font-medium md:text-xl">
          Rekomanduar
        </span>
      </div>
    </div>

    <div class="flex flex-col p-4 gap-4">

      <!-- Plan + Price -->
      <div class="flex justify-between items-center mt-3">
        <h3 class="text-primary font-semibold text-lg md:text-3xl">
          {{ badgeText }}
        </h3>

        <h2 class="text-primary font-semibold text-2xl md:text-4xl">
          {{ currency }}{{ price }}<span class="text-sm md:text-xl opacity-50">.{{ decimal }}</span>
          <span class="text-xs font-normal text-gray-500">
            / {{ priceDescription }}
          </span>
        </h2>
      </div>

      <div class="border-t border-[#353535]/40 my-2"></div>

      <!-- Features -->
      <div class="flex flex-col gap-2">
        <h4 class="text-sm font-semibold text-primary md:text-xl">
          Përfshirë:
        </h4>

        <div
          v-for="(feature, i) in features"
          :key="i"
          class="flex items-center gap-2"
        >
          <!-- Included -->
          <template v-if="!feature.locked">
            <div class="w-2.5 h-2.5 bg-primary rounded-full"></div>
            <p class="text-sm text-primary md:text-lg">
              {{ feature.text || feature }}
            </p>
          </template>

          <!-- Locked -->
          <template v-else>
            <div class="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
            <p class="text-sm text-gray-400 md:text-lg">
              {{ feature.text || feature }}
            </p>
          </template>
        </div>
      </div>

      <!-- CTA -->
      <button
        @click="$emit('select', planType)"
        class="w-full py-3 bg-primary text-secondary rounded-lg text-sm font-semibold md:text-xl hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary transition-all duration-200 cursor-pointer"
      >
        Zgjidh Planin
      </button>

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