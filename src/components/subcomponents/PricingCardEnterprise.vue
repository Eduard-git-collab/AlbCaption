<template>
    <div class="relative w-full rounded-xl overflow-hidden p-4 lg:hidden block
              bg-linear-to-br from-secondary from-[-30%] to-primary to-40%">

    <!-- Overlay (lighter for mobile) -->
    <div class="absolute inset-0 opacity-10 pointer-events-none grid-overlay"></div>

    <div class="relative z-10 flex flex-col gap-4">

      <!-- Title -->
      <h3 class="text-2xl text-secondary text-kollektif-bold md:text-4xl">
        Custom Plan
      </h3>

      <!-- Optional description -->
      <p class="text-sm text-secondary opacity-80 md:text-lg">
        Zgjidhje të personalizuara për biznesin tuaj.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col gap-2">
        <button class="w-full py-3 rounded-md bg-primary text-secondary text-sm font-semibold md:text-lg hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary duration-200 cursor-pointer">
          Kontakto
        </button>

        <button class="w-full py-3 rounded-md bg-secondary text-primary text-sm font-semibold md:text-lg hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary duration-200 cursor-pointer">
          Apliko për demo
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/20 my-2"></div>

      <!-- Features -->
      <ul class="flex text-secondary text-center flex-col gap-2 text-sm md:text-xl">
        <li class="flex items-start gap-2">
          • Feature one description
        </li>
        <li class="flex items-start gap-2">
          • Feature two description
        </li>
        <li class="flex items-start gap-2">
          • Feature three description
        </li>
        <li class="flex items-start gap-2">
          • Feature four description
        </li>
      </ul>

    </div>
  </div>

  <div class="w-full h-fit overflow-hidden relative p-3 rounded-md md:flex-row gap-5 hidden lg:block
        bg-linear-to-r from-secondary from-[-30%] to-primary to-40%">
          <div class="grid-overlay absolute scale-200 w-full -transalte-x-1/2 h-screen z-0"></div>
          <div class="w-full h-full flex flex-row justify-between z-10 relative">
            <div class="w-full h-fit p-5 flex flex-col 4xl:gap-7 xl:gap-5 lg:gap-3">
              <h3 class="text-kollektif-bold text-secondary 4xl:text-7xl xl:text-5xl lg:text-3xl ">
                CustomPlan
              </h3>
              <div class="flex flex-row h-fit w-fit gap-5">
                <div class="text-kollektif-bold 4xl:text-4xl xl:text-2xl lg:text-xl bg-primary hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary text-secondary duration-300 transition-all 4xl:px-8 4xl:py-3 xl:px-5 xl:py-1 lg:px-3 lg:py-0.5 rounded-md cursor-pointer">
                  Kontakto
                </div>
                <div class="text-kollektif-bold 4xl:text-4xl xl:text-2xl lg:text-xl bg-secondary hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary text-primary duration-300 transition-all 4xl:px-8 4xl:py-3 xl:px-5 xl:py-1 lg:px-3 lg:py-0.5 rounded-md cursor-pointer">
                  Apliko për demo
                </div>
              </div>
            </div>
            <div class="w-full flex items-center justify-center z-10 relative">
              <ul class="grid grid-cols-2 gap-x-10 gap-y-4 text-secondary 4xl:text-3xl xl:text-lg lg:text-md">
                
                <li class="flex items-start gap-2">
                  Feature one description
                </li>

                <li class="flex items-start gap-2">
                  Feature two description
                </li>

                <li class="flex items-start gap-2">
                  Feature three description
                </li>

                <li class="flex items-start gap-2">
                  Feature four description
                </li>

              </ul>
            </div>
          </div>
        </div>
  </template>
  