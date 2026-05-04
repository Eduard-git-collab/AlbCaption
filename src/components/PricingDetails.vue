<script setup>

const plans = ['Falas', 'Starter', 'Pro', 'Business', 'Enterprise']

const rows = [
  { label: 'Video në muaj', values: ['3', '15', '35', '70', 'Pa limit'] },
  { label: 'Minuta Totale Transkriptimi', values: ['7', '60', '240', '450', 'Pa limit'] },
  { label: 'Minuta Totale për Video', values: ['5', '10', '20', '30', 'Pa limit'] },
  { label: 'Limiti MB për Video', values: ['100', '250', '500', '1000', 'Pa limit'] },
  { 
    label: 'Formate Shkarkimi', 
    values: [
      'TXT\n 1 SRT ose VTT në muaj', 
      'TXT, SRT, VTT\nPa limit', 
      'TXT, SRT, VTT\nPa limit', 
      'TXT, SRT, VTT\nPa limit', 
      'TXT, SRT, VTT\n  Pa limit'
    ] 
  },
  { label: 'Redaktim Manual', values: [true, true, true, true, true] },
  { label: 'Njohje Dialekti Automatike', values: [true, true, true, true, true] },
  { label: 'Transkript i Sinkronizuar', values: [true, true, true, true, true] },
  { label: 'Shërbim me prioritet', values: [false, true, true, true, 'Individual'] },
]
</script>

<template>
  <div class="w-full h-fit p-5 md:p-8 xl:p-10 4xl:p-20">
    
    <div class="w-full overflow-x-auto pb-4 scrollbar-hide">
      <table class="w-full text-left table-auto border-collapse min-w-[1000px] lg:min-w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="w-1/6 py-4 xl:py-6 4xl:py-10"></th>
            
            <th v-for="plan in plans" :key="plan" 
                class="w-1/6 py-4 xl:py-6 4xl:py-10 font-poppins font-bold text-primary text-center
                       text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-4xl 4xl:text-7xl">
              {{ plan }}
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-for="(row, idx) in rows" :key="idx" 
              class="border-b border-gray-200 text-center last:border-0 
                     h-16 lg:h-20 xl:h-24 2xl:h-32 4xl:h-56">
            
            <td class="font-poppins font-light text-left text-primary/70 pr-4
                       text-xs md:text-sm lg:text-base xl:text-xl 2xl:text-3xl 4xl:text-5xl">
              {{ row.label }}
            </td>

            <td v-for="(val, vIdx) in row.values" :key="vIdx" 
                class="font-poppins font-normal text-primary px-2
                       text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-2xl 4xl:text-4xl">
              
              <template v-if="val === true">
                <div class="mx-auto text-primary
                            w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 2xl:w-10 2xl:h-10 4xl:w-16 4xl:h-16">
                  <svg fill="currentColor" viewBox="0 0 305 305" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                    <path d="M152.502,0.001C68.412,0.001,0,68.412,0,152.501s68.412,152.5,152.502,152.5c84.089,0,152.5-68.411,152.5-152.5 S236.591,0.001,152.502,0.001z M152.502,280.001C82.197,280.001,25,222.806,25,152.501c0-70.304,57.197-127.5,127.502-127.5 c70.304,0,127.5,57.196,127.5,127.5C280.002,222.806,222.806,280.001,152.502,280.001z"></path>
                    <path d="M218.473,93.97l-90.546,90.547l-41.398-41.398c-4.882-4.881-12.796-4.881-17.678,0c-4.881,4.882-4.881,12.796,0,17.678 l50.237,50.237c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l99.385-99.385 c4.881-4.882,4.881-12.796,0-17.678C231.269,89.089,223.354,89.089,218.473,93.97z"></path>
                  </svg>
                </div>
              </template>

              <template v-else-if="val === false">
                <span class="opacity-30">-</span>
              </template>

              <template v-else>
                <span class="whitespace-pre-line leading-tight block">{{ val }}</span>
              </template>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>