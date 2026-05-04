<template>
  <div class="w-screen min-h-screen py-10 overflow-hidden">
  <div class="w-full h-full p-2 md:p-5 lg:p-10 4xl:p-20">
    <h3
    data-aos="fade-left"
    data-aos-delay="200" 
    class="text-kollektif-bold text-primary 4xl:text-[12rem] xl:text-9xl lg:text-8xl md:text-7xl lg:text-left text-center text-6xl">
      Redakto Transkriptet <br>
      <span 
      data-aos="fade-left"
      data-aos-delay="500"
      class="text-secondary">E tua</span>
    </h3>
    <div class="w-full flex lg:flex-row flex-col justify-between items-start mt-10">
      
      <!-- Left text col — fixed width so image has room to bleed -->
      <div class="lg:w-[40%] w-full flex flex-col lg:gap-10 gap-5">
        <p class="lg:w-full lg:mx-0 w-10/11 mx-auto text-primary font-poppins font-normal md:font-light 4xl:text-6xl xl:text-4xl md:text-2xl text-lg mt-5 xl:leading-12 4xl:leading-20 lg:leading-8 text-center lg:text-left">
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
            <card class="4xl:w-14 4xl:h-14 xl:w-9 xl:h-9 lg:w-6 lg:h-6 md:w-7 md:h-7 w-3 h-3" />
            <span class="4xl:text-[48px] xl:text-2xl md:text-xl">Pa kartë krediti</span>
          </div>
        </div>
      </div>

      <!-- Image — oversized, shifted right to bleed off screen edge -->
      <div class="lg:w-[62%] w-full mt-10 lg:mt-0 lg:mr-[-8%] shrink-0 self-start
            bg-white rounded-2xl border-[#353535]/70 border-2
            4xl:shadow-[-12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[-5px_5px_0px_rgba(0,0,0,0.25)]">
      <img src="../assets/images/Transcription_demo.png" alt="Login preview" class="w-full h-full object-cover object-left rounded-2xl md:block hidden"/>
      <img src="../assets/images/Transcription_demo_sm.png" alt="Login preview" class="w-full h-full object-cover object-left rounded-2xl md:hidden"/>
</div>

    </div>
  </div>
</div>
</template>

<script setup>
import card from './logos/card.vue'
</script>