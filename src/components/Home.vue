<template>
    <div class="w-screen h-fit">
      <!-- Hero -->
      <div class="bg-[#052B28] w-screen h-screen">
        <div class="w-full h-full p-6">
          <div class="w-full h-full flex flex-row gap-4">
            <div class="w-5/9 h-full flex flex-col justify-center gap-4">
              <div class="w-full h-1/2 flex flex-col gap-2">
                <h1 class="text-[#9FE29E] text-5xl/14 text-kollektif-bold my-3">
                  Shkurto post-produksionin deri në 88%, Transkripto Automatikisht Gjuhën Shqipe
                </h1>
                <span class="text-white text-md font-poppins font-light w-2/3 leading-7">
                  Tërhiq vëmëndjen, rrit shikimet. Fuqizuar nga AI për skuadra dhe influencera. 
                </span>
                <div class="w-full flex flex-row">
                <router-link 
                  to="/signup" 
                  class="w-64 h-12 bg-[#9FE29E] hover:bg-transparent hover:border hover:border-[#9FE29E] text-[#052B28] hover:text-white text-lg rounded-full flex items-center justify-center transition-colors"
                >
                  Provo Falas
                </router-link>
              </div>
              </div>
              
            </div>
            <div class="w-4/9 h-full flex items-center">
              <Hero_svg class="w-full h-auto"/>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Section 2 -->
      <div class="w-screen h-fit">
        <div class="w-full h-full px-6 py-12 my-10">
            <div class="h-fit w-full flex flex-row items-center justify-between px-12 my-4">
                <h1 class="text-8xl w-5/7 text-kollektif-bold text-[#052B28]">
                    69% e postimeve
                </h1>
                <span class="w-2/7 text-sm font-poppins font-light">
                    Gjasat janë që, nëse po publikon një video të pa titruar, audienca jote nuk ka për ta parë. 69% e shikuesëve ne ambjente publike ose zyra përdorin rrjete sociale me zërin e fikur. 25% e përdoruesve e bejnë këtë dhe në ambjente private. Titrat janë kthyer në një domosdoshmeri për bizneset dhe influencerat.
                </span>
            </div>
            <div class="h-fit w-full flex flex-row items-center px-12 my-4">
                <img src="../assets/images/pexels-amina-filkins-5427978.png" class="h-32 w-92 object-cover object-bottom rounded-full mr-8">
                <h1 class="text-8xl w-5/7 text-kollektif-bold text-[#052B28]">
                    në rrjete sociale
                </h1>
            </div>
            <div class="h-fit w-full flex flex-row items-center px-12 my-6">
                <h1 class="text-8xl w-full text-kollektif-bold text-[#052B28] relative">
                    shikohen 
                    <span class="relative inline-block">
                        me zërin e fikur
                        <Curved_line/>
                    </span>
                </h1>
            </div>
        </div>
        <div class="my-42 w-full h-fit px-6">
          <div class="w-full h-fit flex justify-center items-center flex-row gap-8 px-12 my-42">
              <div class="w-2/5">
                <img src="../assets/images/pexels-mart-production-7679465.jpg" class="shadow-gray-500 shadow-2xl h-96 w-full object-cover object-bottom rounded-lg">
              </div>
              <div class="w-3/5 h-fit flex flex-col gap-4 justify-end items-end">
                <h1 class="text-6xl/18 text-kollektif-bold text-[#052B28] text-right">
                  Bizneset Moderne Kerkojne Zgjidhje Praktike
                </h1>
                <span class="font-poppins font-normal text-[#052B28] text-right w-4/5 leading-6">
                  Nëse po përpiqesh të ndërtosh një audiencë në TikTok, Instagram apo YouTube për të shitur produkte ose për të rritur ndikimin tënd, titrimi manual i videove mund të të kushtojë orë të tëra. Orë që mund t’i shpenzosh për të krijuar videon e radhës, për të rritur biznesin apo për të kontaktuar klientin tënd të ardhshëm.
                </span>
                <button class="cursor-pointer group relative h-12 overflow-hidden overflow-x-hidden rounded-full bg-[#052B28] px-8 py-2 text-neutral-50">
                  <span class="relative font-poppins z-10">Regjistrohu Tani</span>
                  <span class="absolute inset-0 overflow-hidden rounded-full">
                    <span class="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-[#9FE29E] transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span>
                  </span>
                </button>
              </div>
          </div>
          <div class="w-full h-fit flex justify-center items-center flex-row-reverse gap-8 px-12 my-42">
            <div class="w-2/5">
              <img src="../assets/images/pexels-mart-production-7679465.jpg" class="shadow-gray-500 shadow-2xl h-96 w-full object-cover object-bottom rounded-lg">
            </div>
            <div class="w-3/5 h-fit flex flex-col gap-4 justify-start items-start">
              <h1 class="text-6xl/16 text-kollektif-bold text-[#052B28] text-left">
                Nuk ka rëndesi thelbi i videos nëse askush nuk po e shikon
              </h1>
              <span class="font-poppins font-normal text-[#052B28] text-left w-4/5 leading-6">
                Audiencat nuk ndërtohen për një ditë. Suksesi në rrjetet sociale kërkon strategji dhe mjete specifike për të tërhequr vëmendjen dhe për të mbajtur audiencën të angazhuar. 
              </span>
            </div>
          </div>
          <div class="w-full h-fit flex justify-center items-center flex-row gap-8 px-12 my-42">
            <div class="w-2/5">
              <img src="../assets/images/pexels-mart-production-7679465.jpg" class="shadow-gray-500 shadow-2xl h-96 w-full object-cover object-bottom rounded-lg">
            </div>
            <div class="w-3/5 h-fit flex flex-col gap-4 justify-end items-end">
              <h1 class="text-6xl/18 text-kollektif-bold text-[#052B28] text-right">
                98% saktësi në çdo dialekt nga AlbCaptions
              </h1>
              <span class="text-md font-poppins font-normal text-[#052B28] text-right w-4/5 leading-6">
                AlbCaptions përdor një proces të automatizuar që konverton zërin në titra dhe i sinkronizon ato me videon përkatëse. Me ndihmën e Inteligjencës Artificiale, sistemi ynë realizon pjesën më të madhe të punës, duke e bërë procesin të shpejtë dhe jashtëzakonisht të saktë (deri në 98%).
              Për 2% që mbetet, AlbCaptions ofron mjete të integruara për redaktim manual, ku përdoruesit mund të korrigjojnë tekstin me lehtësi dhe të arrijnë rezultate 100% të sakta.
              </span>
              
            </div>
        </div>
        </div>
        <div class="my-20 w-full h-fit px-6">
          <div class="w-full h-fit flex justify-center items-center flex-col gap-8 px-12 my-42">
            
          </div>
        </div>
      </div>
    </div>
    <NewUpload />
    <Payment />
  </template>

  <script setup>
  import NewUpload from './NewUpload.vue';
  import Hero_svg from './items/Hero_svg.vue';
  import Curved_line from './items/Curved_line.vue';
  import Payment from './Payment.vue';
  </script>
