<template>
    <div class="p-4">
        <div class="w-full h-screen bg-[#060a23] rounded-3xl">
          <div class="flex flex-col justify-center items-center h-full">
            <div class="flex flex-col gap-2 my-10">
              <h1 class="text-6xl font-bold text-white text-center">
                Hero text
              </h1>
              <p class="text-4xl text-white text-center font-medium">
                Hero description
              </p>
            </div>
            <div class="flex flex-row gap-6">
              <button class="w-fit h-fit px-5 py-2 text-2xl rounded-xl border-2 border-violet-500 bg-violet-500 text-white 
              hover:bg-violet-600 duration-300 transition-all cursor-pointer">
                Try out
              </button>
              <button class="w-fit h-fit px-5 py-2 rounded-xl text-2xl border-2 border-violet-500 text-white 
              hover:border-violet-600 duration-300 transition-all cursor-pointer">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
</template>