<template>
  <section class="relative w-full bg-primary overflow-hidden">
    <!-- Hero Section -->
    <div class="relative w-full min-h-screen overflow-hidden flex">
      <div class="w-full min-h-screen flex-col items-center justify-start flex">
        <!-- Background Lines (static) -->
        <div class="absolute inset-0 z-0 xl:-bottom-1/3 4xl:-bottom-1/4 overflow-hidden pointer-events-none">
          <div class="w-full h-full flex items-end justify-center">
            <logo_lines class="w-full h-2/3 translate-y-1/3 object-fill text-secondary/20" />
          </div>
        </div>
  
        <!-- Hero Content -->
        <div
          class="w-full min-h-screen relative z-10 flex flex-col 2xl:gap-15 4xl:gap-20 lg:gap-10 gap-5
                 items-center justify-center xl:mx-10 4xl:mx-15 lg:mx-5 md:mx-3 mx-2"
        >
          <div class="xl:max-w-[85%] lg:max-w-6xl mx-auto h-fit flex flex-col">
            <div class="w-fit h-fit items-center justify-center flex flex-row">
              <h1 class="2xl:text-[130px] 4xl:text-[172px] xl:text-8xl lg:text-6xl md:text-5xl text-4xl text-kollektif-bold text-secondary text-center">
                Tërhiq më shumë shikues - Mbaja vëmëndjen më gjatë, duke postuar më pak
              </h1>
            </div>
          </div>
  
          <h3 class="4xl:text-[60px] 2xl:text-4xl xl:text-3xl lg:text-xl md:text-xl text-md text-secondary font-poppins lg:font-light mx-3 text-center">
            AlbCaptions është platforma automatike për titrimin e gjuhës Shqipe
          </h3>
  
          <div class="w-fit h-fit flex 2xl:gap-7 4xl:gap-10 gap-3 flex-col items-center justify-center">
            <div class="w-fit h-fit flex 4xl:gap-8 2xl:gap-6 xl:gap-4 gap-3">
                <RouterLink
              to="/signup"
              class="4xl:text-[48px] 2xl:text-4xl xl:text-2xl text-primary bg-secondary 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 4xl:rounded-xl px-3 py-2 rounded-md
                     text-kollektif-bold text-xl hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary duration-200"
            >
              Titro Falas Tani
            </RouterLink>
            <RouterLink
              to="/signup"
              class="4xl:text-[48px] 2xl:text-4xl xl:text-2xl text-secondary bg-primary 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 4xl:rounded-xl px-3 py-2 rounded-md
                     text-kollektif-bold text-xl ring-2 ring-secondary hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary duration-200"
            >
              Krijo Llogari
            </RouterLink>
            </div>
  
            <div class="w-fit h-fit flex flex-row items-center 4xl:gap-5 gap-2">
              <card class="4xl:w-7.5 4xl:h-7.5 2xl:w-6 2xl:h-6 w-5 h-5 text-secondary" />
              <p class="4xl:text-[30px] 2xl:text-xl text-secondary text-sm font-poppins">Pa Kartë Krediti</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="relative w-full bg-white overflow-hidden">
    <div class="w-screen h-fit">
        <div class="w-full h-full 4xl:p-15 lg:p-10 p-6">
            <div class="w-full h-full flex flex-col lg:gap-10 gap-6">
                <h2 class="text-primary 4xl:text-[200px] 2xl:text-9xl xl:text-8xl md:text-7xl text-3xl text-kollektif-bold ">
                    Çfarë është <span class="text-secondary">AlbCaptions.com?</span> 
                </h2>
                <p class="text-primary font-poppins font-normal 4xl:leading-15 4xl:text-5xl 2xl:text-3xl xl:text-2xl lg:text-lg md:text-xl text-sm ">
                    Themeluar në 2025, Albcaptions është një platformë e cila automatizon pjesën e mërzitshme dhe të lodhshme të titrimit të: dokumentareve, podcasteve, filmave, emisioneve televizive dhe videove në rrjeteve sociale. Me një fokus të theksuar në komunitet, AlbCaptions kërkon të thjeshtojë mënyrën dhe praktikën e krijimit të videove për profesionistë si dhe të rinjë ne industrinë kreative.
                    <br><br>
                    Në ditët e sotme, AlbCaptions shfrytëzon inteligjencën artificiale për të fuqizuar industrinë kreative Shqiptare duke zëvendësuar barrierat e punës manuale me automatizime praktike për të shpejtuar rrugën drejtë kreativitetit.
                </p>
                <div
                class="max-w-full w-full mx-auto relative z-20 4xl:rounded-4xl rounded-2xl 4xl:shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[5px_5px_0px_rgba(0,0,0,0.25)]"
                >
                <wistia-player media-id="oco4fzfyr8"></wistia-player>
                </div>
            </div>
        </div>
    </div>
  </section>
  <section class="w-full h-full">
    <div class="w-full h-full 4xl:p-15 lg:p-10 p-6">
        <div class="w-full h-full gap-6 flex flex-col lg:hidden">
          <div class="w-full h-fit bg-cream rounded-2xl p-10 relative overflow-hidden">
            
            <div class="absolute inset-0 flex translate-y-1/3 items-center justify-end pointer-events-none">
            <Albcaption_logo_inv_nobg class="md:w-[300px] w-[100px] opacity-20 translate-x-1/2" />
            </div>

            <div class="relative z-10 flex flex-col items-center h-full justify-center gap-2">
              <div class="md:w-30 md:h-30 w-28 h-28 rounded-full bg-primary">
                  <!-- <img src="../assets/images/pexels-amina-filkins-5427978.png" class="w-full h-full rounded-full object-cover"> -->
              </div>
              <h3 class="text-primary md:text-7xl text-3xl text-center text-kollektif-bold">Name Surname</h3>
              <p class="text-primary md:text-3xl text-sm text-center font-poppins">Role</p>
            </div>

            <div class="absolute z-0 top-0 left-0 -translate-y-1/4 -translate-x-1/4 md:w-80 md:h-80 w-50 h-50 -rotate-200">
              <img src="../assets/images/CurvedLines.png" class="w-full h-full object-contain">
            </div>

          </div>
          <div class="w-full h-fit bg-cream rounded-2xl p-10 relative overflow-hidden">
            
            <div class="absolute inset-0 flex translate-y-1/3 items-center justify-start pointer-events-none">
            <Albcaption_logo_inv_nobg class="md:w-[300px] w-[100px] opacity-20 -translate-x-1/2 -scale-x-100" />
            </div>

            <div class="relative z-10 flex flex-col items-center h-full justify-center gap-2">
              <div class="md:w-30 md:h-30 w-28 h-28 rounded-full bg-primary">
                  <!-- <img src="../assets/images/pexels-amina-filkins-5427978.png" class="w-full h-full rounded-full object-cover"> -->
              </div>
              <h3 class="text-primary md:text-7xl text-3xl text-center text-kollektif-bold">Name Surname</h3>
              <p class="text-primary md:text-3xl text-sm text-center font-poppins">Role</p>
            </div>

            <div class="absolute z-0 top-0 right-0 -translate-y-1/4 translate-x-1/4 md:w-80 md:h-80 w-50 h-50 rotate-200 -scale-x-100">
              <img src="../assets/images/CurvedLines.png" class="w-full h-full object-contain">
            </div>

          </div>
        </div>
        <div class="w-full h-full gap-6 hidden lg:flex">

        <!-- LEFT CARD -->
        <div class="w-full h-[45vh] bg-cream rounded-2xl p-10 relative overflow-hidden">
            
            <div class="absolute inset-0 flex translate-y-1/3 items-center justify-end pointer-events-none">
            <Albcaption_logo_inv_nobg class="4xl:w-[400px] 2xl:w-[300px] xl:w-[250px] w-[180px] opacity-20 translate-x-1/2" />
            </div>

            <div class="relative z-10 flex flex-col items-center h-full justify-center 4xl:gap-8 2xl:gap-5 xl:gap-3">
              <div class="4xl:w-80 4xl:h-80 2xl:w-60 2xl:h-60 xl:w-40 xl:h-40 w-28 h-28 rounded-full bg-primary">
                  <!-- <img src="../assets/images/pexels-amina-filkins-5427978.png" class="w-full h-full rounded-full object-cover"> -->
              </div>
              <h3 class="text-primary 4xl:text-[160px] 2xl:text-8xl xl:text-7xl text-5xl text-center text-kollektif-bold">Name Surname</h3>
              <p class="text-primary 4xl:text-[64px] 2xl:text-4xl xl:text-xl text-lg text-centerfont-poppins">Role</p>
            </div>

            <div class="absolute z-0 top-0 left-0 -translate-y-1/4 -translate-x-1/4 4xl:w-[800px] 4xl:h-[800px] 2xl:w-[600px] 2xl:h-[600px] xl:w-90 xl:h-90 w-70 h-70 -rotate-200">
              <img src="../assets/images/CurvedLines.png" class="w-full h-full object-contain">
            </div>
        </div>

        <!-- RIGHT CARD -->
        <div class="w-full h-[45vh] bg-cream rounded-2xl p-10 relative overflow-hidden">
            
          <div class="absolute inset-0 flex translate-y-1/3 -left-2 items-center justify-start pointer-events-none">
            <Albcaption_logo_inv_nobg class="4xl:w-[400px] 2xl:w-[300px] xl:w-[250px] w-[180px] opacity-20 -translate-x-1/2" />
          </div>
            
            <div class="relative z-10 flex flex-col items-center h-full justify-center 4xl:gap-8 2xl:gap-5 xl:gap-3">
              <div class="4xl:w-80 4xl:h-80 2xl:w-60 2xl:h-60 xl:w-40 xl:h-40 w-28 h-28 rounded-full bg-primary">
                  <!-- <img src="../assets/images/pexels-amina-filkins-5427978.png" class="w-full h-full rounded-full object-cover"> -->
              </div>
              <h3 class="text-primary 4xl:text-[160px] 2xl:text-8xl xl:text-7xl text-5xl text-center text-kollektif-bold">Name Surname</h3>
              <p class="text-primary 4xl:text-[64px] 2xl:text-4xl xl:text-xl text-lg text-center font-poppins">Role</p>
            </div>

            <div class="absolute z-0 top-0 right-0 -translate-y-1/4 translate-x-1/4 4xl:w-[800px] 4xl:h-[800px] 2xl:w-[600px] 2xl:h-[600px] xl:w-90 xl:h-90 w-70 h-70 rotate-200 -scale-x-100">
              <img src="../assets/images/CurvedLines.png" class="w-full h-full object-contain">
            </div>
        </div>

        </div>
    </div>
  </section>
  <div class="relative">
      <!-- Sticky FAQ container -->
      <div class="sticky top-0 z-0">
        <section class="w-screen h-full lg:hidden block">
          <div class="w-full h-fit 4xl:p-15 lg:p-10 p-6">
            <div class="w-full h-[65vh] bg-linear-to-t from-secondary from-[-30%] to-primary to-40% rounded-xl relative">
              <div class="absolute inset-0 overflow-hidden rounded-xl">
                <div class="grid-overlay absolute scale-200 w-full translate-x-1/2 h-[50vh] z-0"></div>
              </div>
              <div class="w-full h-full flex flex-col">
                <div class="w-[80%] mx-auto h-full flex flex-col gap-5 justify-center relative z-10 px-10 text-center">
                    <h2 class="md:text-7xl text-4xl text-secondary text-kollektif-bold">
                      Krjio me vetëbesim
                    </h2>
                    <p class="text-secondary md:text-3xl text-lg font-poppins text-center">
                      Provo titrimin automatik falas dhe mos ki frikë të na <RouterLink class="underline" to="/contact">kontaktosh</RouterLink> nëse has vështirësi.
                    </p>
                </div>
                <div class="w-2/4 h-1/2 relative">
                  <div class="absolute z-10 translate-y-1/3 h-50 w-50 bottom-0 translate-x-1/3 rounded-[13%] border-20 bg-white border-white">
                    <Albcaptions_logo_inv/>
                  </div>          
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="w-screen h-full hidden lg:block">
          <div class="w-full h-fit 4xl:p-15 lg:p-10 p-6">
            <div class="w-full h-[25vh] bg-linear-to-r from-secondary from-[-30%] to-primary to-40% rounded-xl relative">
              <div class="absolute inset-0 overflow-hidden rounded-xl">
                <div class="grid-overlay absolute scale-200 w-full translate-x-1/2 h-[50vh] z-0"></div>
              </div>
              <div class="w-full h-full flex gap-10">
                <div class="w-2/4 h-full relative">
                  <div class="absolute z-10 translate-y-1/3 4xl:h-100 4xl:w-100 2xl:h-80 2xl:w-80 lg:h-50 lg:w-50 bottom-0 left-1/3 rounded-[13%] border-20 bg-white border-white">
                    <Albcaptions_logo_inv/>
                  </div>          
                </div>
                <div class="w-full h-full flex flex-col justify-center relative z-10 px-10">
                    <h2 class="4xl:text-[200px] 2xl:text-9xl xl:text-8xl lg:text-6xl text-secondary text-kollektif-bold">
                      Krjio me vetëbesim
                    </h2>
                    <p class="text-secondary 4xl:text-5xl 2xl:text-3xl lg:text-lg font-poppins text-left">
                      Provo titrimin automatik falas dhe mos ki frikë të na<br> <RouterLink class="underline" to="/contact">kontaktosh</RouterLink> nëse has vështirësi.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="h-[10vh]"></div>
      </div>
      <FooterComponent class="z-50 shadow-2xl bg-white"/>
  </div>
</template>

<script setup>
import Albcaption_logo_inv_nobg from './logos/Albcaption_logo_inv_nobg.vue';
import Logo_lines from './logos/Logo_lines.vue';
import card from './logos/card.vue';
import FooterComponent from './FooterComponent.vue';
import Albcaptions_logo_inv from './logos/Albcaptions_logo_inv.vue';
</script>