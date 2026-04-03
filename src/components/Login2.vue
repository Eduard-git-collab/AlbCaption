<template>
    <div class="min-w-screen min-h-screen font-[Helvetica_Neue,Arial,sans-serif] animate-bg-pan"
         style="background: linear-gradient(-45deg, #FDF3F1, #FAF9F8, #F5E6E2, #FAF0EE, #FDE8E4); background-size: 400% 400%;">

        <div class="w-full min-h-screen p-3 sm:p-4 md:p-5 flex items-center justify-center">

            <!-- Card: stacks vertically on mobile, side-by-side on md+ -->
            <div class="w-full max-w-[1600px] min-h-[480px] rounded-lg flex flex-col md:flex-row gap-4 md:gap-5 p-4 md:p-5 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.10)] border border-[#E8E0D8] animate-card-enter">

                <!-- Left: Form -->
                <!-- On mobile: full width, less padding. On md+: 2/5 width -->
                <div class="w-full md:w-2/5 flex flex-col items-center justify-center py-8 md:py-0">

                    <!-- Icon -->
                    <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-[#C74634] rounded-2xl flex items-center justify-center mb-4 animate-icon-enter hover:scale-105 hover:shadow-[0_4px_20px_rgba(199,70,52,0.35)] transition-all duration-300">
                        <img
                            src="https://github.com/dcifligu/consultation_images/blob/main/single-unified-registry-system_logo.png?raw=true"
                            class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 select-none pointer-events-none"
                            draggable="false"
                        >
                    </div>

                    <!-- Title & subtitle -->
                    <div class="max-w-[90%] sm:max-w-[80%] text-center mb-2 animate-fade-up px-2" style="animation-delay: 100ms;">
                        <h1 class="text-[#1D1916] text-lg sm:text-xl md:text-[22px] font-semibold tracking-tight">
                            Single Unified Registry System for social insurance
                        </h1>
                        <span class="text-[#6E6259] text-xs sm:text-sm">
                            System administration portal for SURS.
                        </span>
                    </div>

                    <!-- Username -->
                    <input
                        type="text"
                        placeholder="Username"
                        class="w-4/5 sm:w-3/4 mt-5 px-3 py-2 md:py-[9px] text-sm text-[#1D1916] border border-[#C4B9AF] rounded outline-none transition-all duration-150 focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/20 hover:border-[#9E948C] animate-fade-up"
                        style="animation-delay: 180ms;"
                    />

                    <!-- Password -->
                    <input
                        type="password"
                        placeholder="Password"
                        class="w-4/5 sm:w-3/4 mt-3 px-3 py-2 md:py-[9px] text-sm text-[#1D1916] border border-[#C4B9AF] rounded outline-none transition-all duration-150 focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/20 hover:border-[#9E948C] animate-fade-up"
                        style="animation-delay: 240ms;"
                    />

                    <!-- Language dropdown -->
                    <select
                        class="w-4/5 sm:w-3/4 mt-3 px-3 py-2 md:py-[9px] text-sm text-[#6E6259] border border-[#C4B9AF] rounded outline-none bg-white transition-all duration-150 focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/20 hover:border-[#9E948C] cursor-pointer animate-fade-up"
                        style="animation-delay: 300ms;"
                    >
                        <option value="" disabled selected>Select language</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="sq">🇦🇱 Albanian</option>
                        <option value="mk">🇲🇰 Macedonian</option>
                    </select>

                    <!-- Login button -->
                    <button
                        class="w-4/5 sm:w-3/4 mt-5 py-2 md:py-[10px] bg-[#C74634] hover:bg-[#A8392B] hover:shadow-[0_4px_16px_rgba(199,70,52,0.40)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none text-white text-sm font-semibold rounded border-none cursor-pointer transition-all duration-150 animate-fade-up"
                        style="animation-delay: 360ms;"
                    >
                        Login
                    </button>

                    <!-- Remember me -->
                    <div class="flex items-center mt-3 gap-2 animate-fade-up" style="animation-delay: 420ms;">
                        <input type="checkbox" id="rememberMe" class="accent-[#C74634] cursor-pointer" />
                        <label for="rememberMe" class="text-[#6E6259] text-[13px] cursor-pointer">Remember me</label>
                    </div>
                </div>

                <!-- Right: Image panel -->
                <!-- Hidden on mobile, visible from md up. On lg+ gets taller naturally -->
                <div class="hidden md:flex w-3/5 rounded-lg items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#FDF3F1] via-[#FAF0EE] to-[#F5E6E2] min-h-[400px] lg:min-h-[500px]">

                    <!-- Blob top-right -->
                    <div class="absolute -top-15 -right-15 w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] rounded-full bg-[#C74634]/10 animate-blob-float"></div>
                    <!-- Blob bottom-left -->
                    <div class="absolute -bottom-10 -left-10 w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] rounded-full bg-[#C74634]/[0.09] animate-blob-float-reverse"></div>

                    <!-- Bottom-left text overlay -->
                    <div class="absolute bottom-6 left-6 lg:bottom-15 lg:left-15 z-10 select-none animate-fade-up" style="animation-delay: 500ms;">
                        <h1 class="text-white/70 font-semibold text-sm lg:text-md selection:bg-[#F5E6E2]">
                            SURS System <span>Administration</span>
                        </h1>
                        <hr class="border-t-2 border-white/70 mt-1" />
                    </div>

                    <img
                        src="https://github.com/dcifligu/consultation_images/blob/main/Intersect%20(1).png?raw=true"
                        class="w-[85%] lg:w-[75%] h-auto object-contain relative z-0 select-none pointer-events-none animate-img-enter"
                        draggable="false"
                    />
                </div>

                <!-- Mobile-only: slim image strip shown below form on small screens -->
                <div class="flex md:hidden w-full rounded-lg items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#FDF3F1] via-[#FAF0EE] to-[#F5E6E2] h-40">
                    <div class="absolute -top-8 -right-8 w-[120px] h-[120px] rounded-full bg-[#C74634]/10 animate-blob-float"></div>
                    <div class="absolute -bottom-6 -left-6 w-[90px] h-[90px] rounded-full bg-[#C74634]/[0.09] animate-blob-float-reverse"></div>
                    <img
                        src="https://github.com/dcifligu/consultation_images/blob/main/Intersect%20(1).png?raw=true"
                        class="h-32 w-auto object-contain relative z-0 select-none pointer-events-none"
                        draggable="false"
                    />
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* ── Animated background pan ── */
@keyframes bgPan {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.animate-bg-pan {
    animation: bgPan 12s ease infinite;
}

/* ── Card slides up + fades in ── */
@keyframes cardEnter {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-card-enter {
    animation: cardEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Icon drops in ── */
@keyframes iconEnter {
    from { opacity: 0; transform: translateY(-16px) scale(0.85); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-icon-enter {
    animation: iconEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

/* ── Staggered fade-up for form elements ── */
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
    animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Image slides in from right ── */
@keyframes imgEnter {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
}
.animate-img-enter {
    animation: imgEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

/* ── Blob slow float ── */
@keyframes blobFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-18px) scale(1.04); }
}
.animate-blob-float {
    animation: blobFloat 7s ease-in-out infinite;
}
.animate-blob-float-reverse {
    animation: blobFloat 9s ease-in-out infinite reverse;
}
</style>