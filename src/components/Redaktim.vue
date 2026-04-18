<template>
  <div class="w-screen h-fit py-10  overflow-x-hidden">
    <div class="w-full h-full p-2 md:p-5 lg:p-10 4xl:p-20">
      <h3 class="text-kollektif-bold text-primary 4xl:text-[12rem] xl:text-9xl lg:text-8xl md:text-7xl lg:text-left text-center text-6xl">
        Redakto Transkriptet <br>
        <span class="text-secondary">E tua</span>
      </h3>
      <div class="w-full h-full flex lg:flex-row flex-col justify-between">
        <div class="4xl:w-1/3 w-full h-1/3 flex flex-col lg:gap-10 gap-5 mt-10">
          <p class="lg:w-full lg:mx-0 w-10/11 mx-auto h-fit text-primary font-poppins font-normal md:font-light 4xl:text-6xl xl:text-4xl md:text-2xl text-lg  mt-5 xl:leading-12 4xl:leading-20 lg:leading-8 text-center lg:text-left">
            Kontrollo, korrigjo, përmirëso cilesinë e transkriptit përpara se ta shkarkosh.<br class="md:hidden">
            Ruaj sinkronizimin e fjalëve duke redaktuar transkriptin brënda AlbCaptions.
          </p>
          <div class="w-full h-fit flex lg:flex-row flex-col items-center gap-5 lg:gap-10 lg:mt-10">
            <RouterLink
              to="/signup"
              class="4xl:text-[48px] xl:text-2xl lg:text-xl md:text-lg text-secondary bg-primary 4xl:px-12 4xl:py-4 4xl:rounded-xl xl:px-6 xl:py-3 lg:px-5 md:px-4 px-3 py-2 rounded-md
                     text-kollektif-bold text-xl hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary duration-200"
            >
              Provo Redaktimin
            </RouterLink>

            <div class="w-fit h-fit flex flex-row items-center 4xl:gap-5 gap-2 text-secondary">
              <card class="4xl:w-14 4xl:h-14 xl:w-9 xl:h-9 lg:w-6 lg:h-6 md:w-7 md:h-7 w-3 h-3 " />
              <span class="4xl:text-[48px] xl:text-2xl md:text-xl">Pa kartë krediti</span>
            </div>
          </div>
        </div>
        <div class="lg:w-2/3 h-3/4 w-full md:self-center-safe translate-y-1/4 md:translate-y-0 bg-white rounded-2xl border-[#353535]/70 border-2 relative overflow-x-hidden translate-x-1/8 4xl:shadow-[-12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[-5px_5px_0px_rgba(0,0,0,0.25)]">
          <img src="../assets/images/pexels-mart-production-7679465.jpg" alt="Login preview" class="w-full h-full object-cover"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import card from './logos/card.vue'
</script>