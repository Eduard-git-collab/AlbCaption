<template>
  
  <div
    class="fixed top-0 flex justify-center h-fit w-full z-100 p-3 duration-300 transition-all"
    :class="showSuccessAlert ?'translate-y-[30px]':'-translate-y-[100px]'"
  >
    <div 
    class="w-fit h-fit p-3 rounded-xl flex items-center border justify-center text-sm font-poppins"
    :class="issuccess ? 'bg-secondary/25 border-secondary text-[#12998e]' : 'bg-[#ffffff]/75 border-secondary text-[#12998e]'"
    >
    {{ successAlertMessage }} 
    </div>
  </div>

  <div class="w-screen h-screen bg-white">
    <div class="p-3 w-full h-full">
      <div class="relative bg-primary w-full rounded-3xl overflow-hidden">
        <div
          class="angled-grid pointer-events-none absolute inset-0"
          style="--angle: 40deg; --grid-size: 22px; --line-opacity: 0.14;"
        ></div>

        <!-- Header -->
        <div class="relative z-10 grid grid-cols-[1fr_auto_1fr] items-start px-3 font-poppins">
          <div></div>
          <div class="absolute top-6 left-6">
            <RouterLink to="/">
              <svg class="w-6 h-6 text-secondary hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </RouterLink>
          </div>

          <div class="rounded-tab h-fit p-2 flex items-center gap-2 px-4 md:px-6">
            <RouterLink to="/upload" class="text-xs md:text-sm text-primary font-poppins cursor-pointer hover:text-secondary transition-all duration-300 ease-in-out">Krijo</RouterLink>
            
              <RouterLink to="/upload" class="w-9 h-9 bg-primary rounded-full hover:w-32 transition-all duration-300 cursor-pointer flex items-center justify-center gap-0 group overflow-hidden">
                <albcaptions_logo_nobg_inv class="w-4 h-4" />
              <div
                class="overflow-hidden max-w-0 group-hover:max-w-[7ch] transition-[max-width] duration-300 ease-out"
              >
                <span
                  class="text-xs md:text-sm text-secondary font-poppins font-medium whitespace-nowrap inline-block wipe-text ml-0 group-hover:ml-1 transition-[margin] duration-300"
                >
                  Ngarko
                </span>
              </div>
            </RouterLink>
            <div
              class="relative"
              @mouseenter="handleEditMouseEnter"
              @mouseleave="handleEditMouseLeave"
              ref="editTrigger"
            >
              <p class="text-xs md:text-sm text-primary font-poppins cursor-pointer select-none">Edito</p>
            </div>
          </div>

          <!-- Top-right icons -->
          <div class="flex items-center justify-self-end w-fit gap-2 p-3 md:p-4 text-secondary">
            <!-- Help -->
            <div
              class="relative"
              @mouseenter="handleHelpMouseEnter"
              @mouseleave="handleHelpMouseLeave"
              ref="helpTrigger"
            >
              <svg
                class="w-5 h-5 cursor-pointer text-secondary hover:text-[#7dd87b] transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8.5v.01M12 16h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
              </svg>
            </div>

            <!-- Profile -->
            <div
              class="relative"
              @mouseenter="handleProfileMouseEnter"
              @mouseleave="handleProfileMouseLeave"
              ref="profileTrigger"
            >

              <div class="flex justify-center items-center" v-if="userData?.avatar_url">
                <img :src="userData.avatar_url" alt="User Avatar" class="object-cover rounded-full w-7 h-7" />
              </div>

              <svg v-else
                class="w-7 h-7 cursor-pointer text-secondary hover:text-[#7dd87b] transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="8" r="4" stroke-width="1.5" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="w-full p-3 z-10 relative">
          <div class="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h1 class="w-fit mx-auto text-[28px] md:text-4xl text-white text-kollektif-bold leading-tight">
              Mirësevini, {{ userData?.name }} {{userData?.surname}}
            </h1>

            <!-- Micro bento grid (super-compact chips) -->
            <div class="grid grid-cols-12 gap-2 md:gap-3 w-full lg:w-1/2 items-stretch font-poppins">
              <!-- Videos -->
              <div
                class="col-span-12 sm:col-span-6 lg:col-span-4 rounded-xl ring-1 ring-secondary/20 bg-secondary/5 h-full"
              >
                <div class="px-3 py-2 h-full">
                  <div class="flex items-center gap-2">
                    <div
                      class="inline-flex items-center justify-center rounded-md text-secondary ring-1 ring-secondary/25 bg-secondary/10 w-7 h-7"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3.5 7.5A2.5 2.5 0 016 5h7a2.5 2.5 0 012.5 2.5v3.2l3.2-1.8A1 1 0 0120 11v2a1 1 0 01-.3.7l-3.2-1.8v3.6A2.5 2.5 0 0113 18H6a2.5 2.5 0 01-2.5-2.5v-8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                        <path d="M8.25 9.75h3.5M8.25 13h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-[11px] text-white">Video të mbetura</p>
                        <p class="text-sm md:text-base font-semibold text-white">
                          {{userRoleDetails?.videos_remaining}}
                        </p>
                      </div>
                      <div class="mt-1 h-px bg-secondary/25 rounded-full overflow-hidden">
                        <div class="h-full bg-secondary" :style="{ width: videoPct + '%' }" />
                      </div>
                      <p class="text-[10px] text-white mt-1">
                        nga {{userRoleDetails?.videos_quota}}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Minutes -->
              <div
                class="col-span-12 sm:col-span-6 lg:col-span-5 rounded-xl ring-1 ring-emerald-300/20 bg-emerald-400/5 h-full"
              >
                <div class="px-3 py-2 h-full">
                  <div class="flex items-center gap-2">
                    <div
                      class="inline-flex items-center justify-center rounded-md text-secondary ring-1 ring-secondary/25 bg-secondary/10 w-7 h-7"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.4" />
                        <path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-[11px] text-white">Minuta të mbetura</p>
                        <p class="text-sm md:text-base font-semibold text-white">
                          {{userRoleDetails?.second_to_minutes_remaining}}
                        </p>
                      </div>
                      <div class="mt-1 h-px bg-secondary/25 rounded-full overflow-hidden">
                        <div class="h-full bg-secondary" :style="{ width: minutesPct + '%' }" />
                      </div>
                      <p class="text-[10px] text-white mt-1">
                        nga {{userRoleDetails?.minutes_quota}} minuta
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Plan (CTA centered) -->
              <div
                class="col-span-12 lg:col-span-3 rounded-xl h-full grid place-items-center p-2"
              >
                <button
                  class="inline-flex items-center px-3 py-1.5 text-[11px] font-medium text-primary bg-secondary rounded-md ring-1 ring-primary/10 cursor-pointer transition-colors hover:bg-[#7dd87b] hover:ring-primary/20"
                  @click="$emit('upgrade')"
                >
                  Përditëso planin
                </button>
              </div>
              <!-- End chips -->
            </div>
          </div>
        </div>
      </div>
      <section class="w-full p-3 z-10 relative">
        <div class="flex items-center justify-between">
          <div class="w-fit h-fit flex gap-3 items-center">
            <h2 class="text-primary text-kollektif-bold text-lg">Transkriptet e fundit</h2>
          </div>
        </div>
      
        <!-- Loading state -->
        <div v-if="transcriptsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 font-poppins">
          <div
            v-for="n in 5"
            :key="n"
            class="rounded-lg bg-white ring-1 ring-primary/10 p-2 animate-pulse"
          >
            <div class="aspect-video rounded-md bg-primary/5"></div>
            <div class="mt-2 h-3 bg-primary/10 rounded"></div>
            <div class="mt-1 h-3 w-1/3 bg-primary/10 rounded"></div>
          </div>
        </div>
      
        <!-- Recent Transcriptions -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 my-5 font-poppins">
          <button
            v-for="t in recentTranscripts"
            :key="t.id"
            type="button"
            @click="goToDetails(t.id)"
            class="group rounded-lg bg-white ring-1 ring-primary/10 hover:ring-primary/20 hover:bg-secondary/5 transition-colors p-2 text-left cursor-pointer"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video rounded-md overflow-hidden ring-1 ring-primary/10 bg-primary/5">
              <video
                v-if="t.video_url"
                :src="t.video_url"
                preload="metadata"
                muted
                playsinline
                class="w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 grid place-items-center text-primary/40">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3.5 7.5A2.5 2.5 0 016 5h7a2.5 2.5 0 012.5 2.5v3.2l3.2-1.8A1 1 0 0120 11v2a1 1 0 01-.3.7l-3.2-1.8v3.6A2.5 2.5 0 0113 18H6a2.5 2.5 0 01-2.5-2.5v-8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                  <path d="M8.25 9.75h3.5M8.25 13h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
      
            <!-- Meta -->
            <div class="mt-2">
              <p class="font-poppins text-[12px] text-primary truncate">
                {{ baseName(t.original_filename) }}
              </p>
              <div class="mt-0.5 flex items-center justify-between">
                <span class="text-[11px] font-poppins text-primary/70">
                  {{ formatDateShort(t.last_updated_at || t.created_at) }}
                </span>
                <span
                  class="text-[11px] font-poppins text-primary bg-secondary/60 rounded px-1.5 py-0.5"
                >{{ formatDuration(t.duration) }}</span>
              </div>
            </div>
          </button>
          <!-- Empty state for recent if none -->
        <div v-if="!transcriptsLoading && recentTranscripts.length === 0" class="mt-2 text-center">
          <p class="text-primary/70 font-poppins text-sm">Asnjë video e fundit.</p>
        </div>
        </div>

        <!-- All transcriptions (Table view) -->
        <div class="flex items-center justify-between mt-2">
          <div class="w-fit h-fit flex gap-3 items-center">
            <h2 class="text-primary text-kollektif-bold text-lg">Transkriptet e mia</h2>
            <div class="flex items-center border border-primary/20 rounded px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary mr-2" fill="currentcolor" viewBox="0 0 24 24">
                <path d="M10.5 2a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zm0 15a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM15.5 15.5l4.5 4.5-1.5 1.5-4.5-4.5z"/>
              </svg>
              <input
                type="text"
                v-model="searchFilename"
                placeholder="Kërko..."
                class="flex-1 text-xs font-poppins py-1 ring-0"
              />
            </div>
            
              <button @click="setFilters()" class="cursor-pointer rounded-lg border-primary text-primary border p-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentcolor" viewBox="0 0 640 640">
                  <path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z"/>
                </svg>
              </button>
          </div>
          <div class="flex items-center gap-2">
            <!-- Items per page -->
            <select v-model="itemsPerPage" class="text-xs font-poppins text-primary bg-white border border-primary/20 rounded px-2 py-1">
              <option value="20">20</option>
              <option value="60">60</option>
              <option value="100">100</option>
              <option value="all">Të gjitha</option>
            </select>

            <!-- Pagination controls -->
            <div class="flex items-center gap-2">
              <button
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                class="px-2 py-1 text-xs font-poppins text-primary bg-white border border-primary/20 rounded disabled:opacity-50"
              >
                &lt; 
              </button>
              <span class="text-xs font-poppins text-primary">
                Faqja {{ currentPage }} nga {{ totalPages }}
              </span>
              <button
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                class="px-2 py-1 text-xs font-poppins text-primary bg-white border border-primary/20 rounded disabled:opacity-50"
              >
               &gt;
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div
        class="grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
        :class="showFilters ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'"
        >
          <!-- Inner wrapper must be allowed to shrink -->
          <div class="min-h-0">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- Date From -->
              <div class="flex flex-col">
                <label class="text-xs font-poppins text-primary/80 mb-1">Nga data</label>
                <input
                  type="date"
                  v-model="dateFrom"
                  class="text-xs font-poppins text-primary bg-white border border-primary/20 rounded px-2 py-1"
                />
              </div>

              <!-- Date To -->
              <div class="flex flex-col">
                <label class="text-xs font-poppins text-primary/80 mb-1">Deri në datë</label>
                <input
                  type="date"
                  v-model="dateTo"
                  class="text-xs font-poppins text-primary bg-white border border-primary/20 rounded px-2 py-1"
                />
              </div>

              <!-- Sort By -->
              <div class="flex flex-col">
                <label class="text-xs font-poppins text-primary/80 mb-1">Rendit sipas</label>
                <select
                  v-model="sortBy"
                  class="text-xs font-poppins text-primary bg-white border border-primary/20 rounded px-2 py-1">
                  <option value="created_at">Data e krijimit</option>
                  <option value="original_filename">Emri</option>
                  <option value="duration">Kohëzgjatja</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="text-xs font-poppins text-primary/80 mb-1">Rendi</label>
                <select
                  v-model="sortOrder"
                  class="text-xs font-poppins text-primary bg-white border border-primary/20 rounded px-2 py-1">
                  <option value="desc">Zbritës</option>
                  <option value="asc">Ngjitës</option>
                </select>
              </div>
              </div>
          </div>
        </div>
        <div class="mt-6">
          <div v-if="filteredTransactions.length > 0" class="overflow-x-auto rounded-xl ring-1 ring-primary/10 bg-white font-poppins">
            <table class="min-w-full divide-y divide-primary/10">
              <thead class="bg-secondary/10">
                <tr>
                  <th scope="col" class="px-3 md:px-4 py-2 text-left text-xs font-semibold text-primary/80 tracking-wide">Emri</th>
                  <th scope="col" class="px-3 md:px-4 py-2 text-left text-xs font-semibold text-primary/80 tracking-wide">Krijuar</th>
                  <th scope="col" class="px-3 md:px-4 py-2 text-left text-xs font-semibold text-primary/80 tracking-wide">Përditësuar</th>
                  <th scope="col" class="px-3 md:px-4 py-2 text-right text-xs font-semibold text-primary/80 tracking-wide">Veprime</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/10">
                <tr
                  v-for="(t, index) in paginatedTransactions"
                  :key="t.id || index"
                  class="hover:bg-secondary/5"
                >
                  <!-- File with media icon and truncated name -->
                  <td class="px-3 md:px-4 py-2">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center justify-center w-7 h-7 rounded-md ring-1 ring-primary/10 bg-primary/5 text-primary">
                        <!-- Video icon -->
                        <svg v-if="getMediaType(t.original_filename) === 'video'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke-width="1.6"/>
                          <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
                        </svg>
                        <!-- Audio icon -->
                        <svg v-else-if="getMediaType(t.original_filename) === 'audio'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 18a3 3 0 100-6 3 3 0 000 6z" stroke-width="1.6"/>
                          <path d="M12 6l7-2v9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!-- Fallback file icon -->
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12V7z" stroke-width="1.6"/>
                          <path d="M14 3v4a2 2 0 002 2h4" stroke-width="1.6"/>
                        </svg>
                      </span>
                      <button
                        type="button"
                        class="text-sm md:text-[13px] text-primary font-medium truncate max-w-[14ch] md:max-w-[24ch] hover:underline text-left"
                        :title="baseName(t.original_filename) || 'Video'"
                        @click="goToDetails(t.id)"
                      >
                        {{ truncateName(baseName(t.original_filename) || 'Video', 10) }}
                      </button>
                    </div>
                  </td>

                  <!-- Created date -->
                  <td class="px-3 md:px-4 py-2 text-[12px] text-primary/80">
                    {{ formatDateShort(t.created_at) }}
                  </td>

                  <!-- Last updated date -->
                  <td class="px-3 md:px-4 py-2 text-[12px] text-primary/80">
                    {{ t.last_updated_at ? formatDateShort(t.last_updated_at) : '—' }}
                  </td>

                  <!-- Actions -->
                  <td class="px-3 md:px-4 py-2">
                    <div class="flex justify-end gap-2">
                      <button
                        class="px-2.5 py-1.5 text-xs md:text-sm bg-secondary text-primary rounded-md ring-1 ring-primary/10 hover:bg-[#7dd87b] transition-colors cursor-pointer"
                        @click="goToDetails(t.id)"
                      >
                        Edito
                      </button>
                      <button
                        class="px-2.5 py-1.5 text-xs md:text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                        @click="promptDelete(t)"
                      >
                        Fshi
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty state for all transcriptions -->
          <div
            v-else
            class="flex flex-col items-center justify-center h-48 text-primary/60 bg-white rounded-xl ring-1 ring-primary/10"
          >
            <p class="text-sm md:text-base font-medium">Nuk u gjëndën transkripte</p>
            <p class="text-xs md:text-sm mt-1">Provoni të ndryshoni filtrat ose të <RouterLink to="/upload" class="text-secondary font-bold">krijoni</RouterLink> një transkript të ri.</p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Dropdowns -->
  <Teleport to="body">
    
    <!-- Edit Dropdown Menu -->
    <div
      v-if="showEditDropdown"
      class="dropdown-menu-portal font-poppins w-fit"
      :style="editDropdownStyle"
      @mouseenter="handleEditMouseEnter"
      @mouseleave="handleEditMouseLeave"
    >
      <div class="max-w-[90vw] max-h-72 overflow-y-auto p-2">
        <!-- Loading skeleton -->
        <div v-if="transcriptsLoading" class="flex flex-wrap gap-2">
          <div v-for="n in 5" :key="n" class="w-[136px] rounded-md p-1">
            <div class="w-full aspect-video rounded-md ring-1 ring-primary/10 bg-primary/5 animate-pulse"></div>
            <div class="mt-1 h-3 w-24 bg-primary/10 rounded animate-pulse"></div>
          </div>
        </div>
      
        <!-- Content -->
        <template v-else>
          <!-- If there are recent videos -->
          <div v-if="recentTranscripts.length > 0" class="flex flex-wrap gap-2">
            <!-- Krijo card -->
            <button
              type="button"
              @click="openCreate"
              class="group w-[136px] rounded-md p-1 hover:bg-secondary/10 transition-colors text-center cursor-pointer"
              title="Krijo"
            >
              <div class="relative w-full aspect-video rounded-md overflow-hidden ring-1 ring-dashed ring-primary/20 bg-primary/5 grid place-items-center">
                <svg class="w-6 h-6 text-primary/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <p class="mt-1 text-[11px] text-primary font-poppins truncate">Krijo</p>
            </button>
      
            <!-- Recent video cards -->
            <button
              v-for="t in recentTranscripts"
              :key="t.id"
              type="button"
              @click="openTranscript(t.id)"
              class="group w-[136px] rounded-md p-1 hover:bg-secondary/10 transition-colors text-left cursor-pointer"
              :title="baseName(t.original_filename)"
            >
              <div class="relative w-full aspect-video rounded-md overflow-hidden ring-1 ring-primary/10 bg-primary/5">
                <video
                  v-if="t.video_url"
                  :src="t.video_url"
                  preload="metadata"
                  muted
                  playsinline
                  class="w-full h-full object-cover pointer-events-none"
                />
                <div v-else class="absolute inset-0 grid place-items-center text-primary/40">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3.5 7.5A2.5 2.5 0 016 5h7a2.5 2.5 0 012.5 2.5v3.2l3.2-1.8A1 1 0 0120 11v2a1 1 0 01-.3.7l-3.2-1.8v3.6A2.5 2.5 0 0113 18H6a2.5 2.5 0 01-2.5-2.5v-8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                    <path d="M8.25 9.75h3.5M8.25 13h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <p class="mt-1 text-[11px] text-primary font-poppins truncate">
                {{ baseName(t.original_filename) }}
              </p>
            </button>
          </div>
      
          <!-- Default when no videos: only Krijo card -->
          <div v-else class="flex flex-wrap gap-2">
            <button
              type="button"
              @click="openCreate"
              class="group w-[136px] rounded-md p-1 hover:bg-secondary/10 transition-colors text-left cursor-pointer"
              title="Krijo"
            >
              <div class="relative w-full aspect-video rounded-md overflow-hidden ring-1 ring-dashed ring-primary/20 bg-primary/5 grid place-items-center">
                <svg class="w-6 h-6 text-primary/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <p class="mt-1 text-[11px] text-primary font-poppins truncate">Krijo</p>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Help Dropdown Menu -->
    <div
      v-if="showHelpDropdown"
      class="dropdown-menu-portal"
      :style="helpDropdownStyle"
      @mouseenter="handleHelpMouseEnter"
      @mouseleave="handleHelpMouseLeave"
    >
      <RouterLink to="/usage" class="dropdown-item">
        <span>Përdorimi</span>
      </RouterLink>
      <RouterLink to="/contact" class="dropdown-item">
        <span>Kontakt</span>
      </RouterLink>
      <a href="#" class="dropdown-item">
        <span>Raporto një problem</span>
      </a>
    </div>

    <!-- Profile Dropdown Menu -->
    <div
      v-if="showProfileDropdown"
      class="dropdown-menu-portal font-poppins"
      :style="profileDropdownStyle"
      @mouseenter="handleProfileMouseEnter"
      @mouseleave="handleProfileMouseLeave"
    >
    <a href="#" class="dropdown-item" @click.prevent="promptEditProfile">
      <span>Profili im</span>
    </a>
      <a href="#" class="dropdown-item">
        <span>Konfigurime</span>
      </a>
      <div class="dropdown-divider"></div>
      <div @click="handleSignOut" class="dropdown-item text-red-400 hover:text-red-300 cursor-pointer group">
        <button class="flex gap-3 items-center h-fit ">
          <svg 
            class="w-5 h-5 cursor-pointer text-primary"
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            viewBox="0 0 640 640">
            <path d="M384 128L448 128L448 544C448 561.7 462.3 576 480 576L512 576C529.7 576 544 561.7 544 544C544 526.3 529.7 512 512 512L512 128C512 92.7 483.3 64 448 64L352 64L352 64L192 64C156.7 64 128 92.7 128 128L128 512C110.3 512 96 526.3 96 544C96 561.7 110.3 576 128 576L352 576C369.7 576 384 561.7 384 544L384 128zM256 320C256 302.3 270.3 288 288 288C305.7 288 320 302.3 320 320C320 337.7 305.7 352 288 352C270.3 352 256 337.7 256 320z"/>
          </svg>
          <span class="cursor-pointer">Dil</span>
        </button>
      </div>
    </div>
  </Teleport>

  <!-- Modals -->
  
  <ConfirmModal
    v-if="showDeleteModal"
    :title="'Fshirje Transkripti'"
    :message="`Jeni të sigurt që doni të fshini '${transactionToDelete?.original_filename}'? Ky veprim nuk mund të zhbëhet.`"
    icon="warning"
    confirm-text="Fshi"
    confirm-variant="danger"
    cancel-text="Anulo"
    :show-footer="true"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    @close="cancelDelete"
>
    <template #body>
    <p v-if="deleteError" class="text-red-600 mb-2">{{ deleteError }}</p>
    <p v-if="deleteLoading" class="text-gray-500">Deleting...</p>
    </template>
  </ConfirmModal>

  <ProfileModal 
    v-model:open="showEditProfileModal"
    @saved="showSuccessAlert = true; 
    successAlertMessage = 'Profili u përditsua me sukses!';
    setTimeout(()=>{ showSuccessAlert.value=false; successAlertMessage='' }, 2500)"   
  />
  
</template>

<script setup>
import albcaptions_logo_nobg_inv from './logos/Albcaption_logo_nobg.vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import ConfirmModal from './items/ModalDialog.vue';
import ProfileModal from './items/ProfileModal.vue';

const baseName = (name) => (name ? name.replace(/\.[^/.]+$/, '') : 'Video')
const formatDateShort = (d) => {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short' })
  } catch {
    return '—'
  }
}
// Truncate helper (defaults to 10 characters)
const truncateName = (str, max = 10) => {
  if (!str) return ''
  return str.length > max ? str.substring(0, max) + '...' : str
}
// Determine media type from filename
const getMediaType = (filename = '') => {
  const ext = (filename.split('.').pop() || '').toLowerCase()
  const videoExt = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v']
  const audioExt = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg', 'oga']
  if (videoExt.includes(ext)) return 'video'
  if (audioExt.includes(ext)) return 'audio'
  return 'unknown'
}

const router = useRouter();
const loading = ref(true);
const transcriptsLoading = ref(true); 
const allUsersLoading = ref(false); 
const userData = ref(null);
const userRoleDetails = ref(null);
const userRoleDetailsLoading = ref(false);
const userRoleDetailsError = ref(null);
const authError = ref(null);
const userTrans = ref([]);
const allUsers = ref([]); 
const showSuccessAlert = ref(false);
const successAlertMessage = ref('');

// Search and Filter State
const searchFilename = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const durationMin = ref('');
const durationMax = ref('');
const sortBy = ref('created_at');
const sortOrder = ref('desc');
const showFilters = ref(false);

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref('20'); // Default to 20 items per page
const jumpToPageInput = ref(null);

// Modal state for transaction deletion
const showDeleteModal = ref(false);
const transactionToDelete = ref(null);
const deleteLoading = ref(false);
const deleteError = ref(null);

// Modal state for user deletion
const showDeleteUserModal = ref(false);
const userToDelete = ref(null);
const deleteUserLoading = ref(false);
const deleteUserError = ref(null);
// Modal state for deactivating account
const showDeactivateModal = ref(false);
const deactivateLoading = ref(false);
const deactivateError = ref(null);
// Modal state for subscription cancellation
const showCancelSubscriptionModal = ref(false);
const cancelSubscriptionLoading = ref(false);
const cancelSubscriptionError = ref(null);
const hasActiveSubscription = ref(false);

//Roles states
const roles = ref([]);
const rolesLoading = ref(false);
const showRoleModal = ref(false);
const roleModalLoading = ref(false);
const roleModalError = ref(null);
const editingRole = ref(null);

// Modal state for Role creation
const showCreateRoleModal = ref(false);
const createRoleLoading = ref(false);
const createRoleError = ref(null);
const newRole = ref({
  name: '',
  price: 0,
  videos_per_month: 0,
  total_aminutes_per_month: 0,
  max_video_duration: 0,
  max_file_size_mb: 0,
  srt_exports_per_month: 0,
  is_admin: false
});
// Modal state for role deletion
const showDeleteRoleModal = ref(false);
const roleToDelete = ref(null);
const deleteRoleLoading = ref(false);
const deleteRoleError = ref(null);

//User update states
const showEditProfileModal = ref(false);
const editProfileForm = ref({
  username: '',
  name: '',
  surname: ''
});
const editProfileLoading = ref(false);
const editProfileError = ref(null);
const editProfileSuccess = ref(null);

// Password change form state
const showPasswordFields = ref(false);
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});
const passwordError = ref(null);
const passwordLoading = ref(false);
const passwordSuccess = ref(null);

const recentTranscripts = ref([])


// Computed property for filtered and sorted transactions
const filteredTransactions = computed(() => {
  let filtered = [...userTrans.value];
  
  // Filter by filename
  if (searchFilename.value.trim()) {
    const searchTerm = searchFilename.value.toLowerCase().trim();
    filtered = filtered.filter(transaction => 
      transaction.original_filename?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by date range
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    filtered = filtered.filter(transaction => 
      new Date(transaction.created_at) >= fromDate
    );
  }
  
  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    toDate.setHours(23, 59, 59, 999); // Include the entire day
    filtered = filtered.filter(transaction => 
      new Date(transaction.created_at) <= toDate
    );
  }
  
  // Filter by duration range
  if (durationMin.value !== '') {
    const minDuration = parseInt(durationMin.value);
    filtered = filtered.filter(transaction => 
      transaction.duration >= minDuration
    );
  }
  
  if (durationMax.value !== '') {
    const maxDuration = parseInt(durationMax.value);
    filtered = filtered.filter(transaction => 
      transaction.duration <= maxDuration
    );
  }
  
  // Sort transactions
  filtered.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy.value) {
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'original_filename':
        aValue = a.original_filename?.toLowerCase() || '';
        bValue = b.original_filename?.toLowerCase() || '';
        break;
      case 'duration':
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
      case 'file_size':
        aValue = a.file_size || 0;
        bValue = b.file_size || 0;
        break;
      default:
        return 0;
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
  
  return filtered;
});

// Pagination computed properties
const totalFilteredItems = computed(() => {
  return filteredTransactions.value.length;
});

const totalPages = computed(() => {
  if (itemsPerPage.value === 'all') return 1;
  return Math.ceil(totalFilteredItems.value / parseInt(itemsPerPage.value));
});

const paginatedTransactions = computed(() => {
  if (itemsPerPage.value === 'all') {
    return filteredTransactions.value;
  }
  
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredTransactions.value.slice(start, end);
});

// Pagination display logic
const startPage = computed(() => {
  const maxPagesToShow = 5;
  const halfRange = Math.floor(maxPagesToShow / 2);
  
  if (totalPages.value <= maxPagesToShow) {
    return 1;
  }
  
  if (currentPage.value <= halfRange) {
    return 1;
  }
  
  if (currentPage.value >= totalPages.value - halfRange) {
    return totalPages.value - maxPagesToShow + 1;
  }
  
  return currentPage.value - halfRange;
});

const endPage = computed(() => {
  const maxPagesToShow = 5;
  return Math.min(startPage.value + maxPagesToShow - 1, totalPages.value);
});

const pageRange = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Watch for filter changes to reset pagination
watch([searchFilename, dateFrom, dateTo, durationMin, durationMax, sortBy, sortOrder], () => {
  resetToFirstPage();
});

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    jumpToPageInput.value = null;
    
    // Scroll to top of video grid on next tick
    setTimeout(() => {
      const videoGrid = document.querySelector('.grid');
      if (videoGrid) {
        videoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
};

const jumpToPage = () => {
  if (jumpToPageInput.value && jumpToPageInput.value >= 1 && jumpToPageInput.value <= totalPages.value) {
    goToPage(jumpToPageInput.value);
  }
};

const resetToFirstPage = () => {
  currentPage.value = 1;
  jumpToPageInput.value = null;
};


// Open edit modal and fill form
const promptEditProfile = () => {
  showEditProfileModal.value = true;
  editProfileForm.value = {
    username: userData.value.username || '',
    name: userData.value.name || '',
    surname: userData.value.surname || ''
  };
  editProfileError.value = null;
  editProfileSuccess.value = null;
  showPasswordFields.value = false;
  passwordForm.value = { current: '', new: '', confirm: '' };
  passwordError.value = null;
  
};

const closeEditProfileModal = () => {
  showEditProfileModal.value = false;
};

// Save profile changes
const saveProfile = async () => {
  editProfileLoading.value = true;
  editProfileError.value = null;
  editProfileSuccess.value = null;
  try {
    const { error } = await supabase
      .from('users')
      .update({
        username: editProfileForm.value.username,
        name: editProfileForm.value.name,
        surname: editProfileForm.value.surname
      })
      .eq('id', userData.value.id);
    if (error) throw error;
    editProfileSuccess.value = 'Profile updated!';
    userData.value.username = editProfileForm.value.username;
    userData.value.name = editProfileForm.value.name;
    userData.value.surname = editProfileForm.value.surname;
    setTimeout(() => {
      showEditProfileModal.value = false;
      editProfileSuccess.value = null;
    }, 1200);
  } catch (err) {
    editProfileError.value = err.message || 'Failed to update profile.';
  } finally {
    editProfileLoading.value = false;
  }
};

// Password change logic
const changePassword = async () => {
  passwordLoading.value = true;
  passwordError.value = null;
  passwordSuccess.value = null;
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    passwordError.value = 'All password fields are required.';
    passwordLoading.value = false;
    return;
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordError.value = 'New password and confirmation do not match.';
    passwordLoading.value = false;
    return;
  }
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.value.email,
      password: passwordForm.value.current
    });
    if (signInError) {
      passwordError.value = 'Current password is incorrect.';
      passwordLoading.value = false;
      return;
    }
    const { error: pwdError } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    });
    if (pwdError) {
      passwordError.value = pwdError.message || 'Failed to update password.';
    } else {
      passwordSuccess.value = 'Password updated!';
      passwordForm.value = { current: '', new: '', confirm: '' };
      setTimeout(() => {
        showPasswordFields.value = false;
        passwordSuccess.value = null;
      }, 1200);
    }
  } catch (err) {
    passwordError.value = err.message || 'Failed to update password.';
  } finally {
    passwordLoading.value = false;
  }
};

const goToDetails = (id) => {
  router.push(`/transaction/${id}`);
};

// Helper function to format duration
const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Clear all filters
const clearFilters = () => {
  searchFilename.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  durationMin.value = '';
  durationMax.value = '';
  sortBy.value = 'created_at';
  sortOrder.value = 'desc';
};

// Set date presets
const setDatePreset = (days) => {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days);
  
  dateFrom.value = pastDate.toISOString().split('T')[0];
  dateTo.value = today.toISOString().split('T')[0];
};

// Function to load user data with debugging
const loadUserData = async () => {
  loading.value = true;
  authError.value = null;

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      authError.value = "Error retrieving session";
      return;
    }

    if (!session) {
      authError.value = "No active session found";
      return;
    }

    const user = session.user;

    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select(`
        *,
        roles!users_role_fkey (
          id,
          name,
          price,
          videos_per_month,
          total_minutes_per_month,
          max_video_duration,
          max_file_size_mb,
          srt_exports_per_month,
          is_admin
        )
      `)
      .eq('id', user.id)
      .single();

    if (dbError || !dbUser) {
      authError.value = "User profile not found in the database.";
      userData.value = null;
      return;
    }

    if (!dbUser.name || !dbUser.surname || !dbUser.username || !dbUser.role) {
      authError.value = "Incomplete user profile data. Please contact support.";
      userData.value = null;
      return;
    }

    userData.value = {
      ...dbUser,
      email: user.email,
      roleName: dbUser.roles?.name || 'Unknown Role'
    };

    console.log("User data loaded successfully:", userData.value);

  } catch (error) {
    authError.value = error.message;
    userData.value = null;
  } finally {
    loading.value = false;
  }
};

// Function to load user role details
const getUserRoleDetails = async () => {
  userRoleDetailsLoading.value = true;
  userRoleDetailsError.value = null;
  try {
    if (!userData.value?.id) return;
    const { data, error } = await supabase
      .from('user_role_details')
      .select('*')
      .eq('id', userData.value.id)
      .single();
    if (error) throw error;
    userRoleDetails.value = data;
  } catch (error) {
    userRoleDetailsError.value = error.message || 'Failed to fetch user role details.';
    userRoleDetails.value = null;
  } finally {
    userRoleDetailsLoading.value = false;
  }
};

//Function to load all roles (admin only)
const getAllRoles = async () => {
  rolesLoading.value = true;
  try {
    const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    roles.value = data || [];
  } catch (error) {
    roles.value = [];
  } finally {
    rolesLoading.value = false;
  }
};

//Function to load users 5 most recent transcripts
const getRecentTranscripts = async () => {
  if (!userData.value?.id) return
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      videos (id, video_url)
    `)
    .eq('user_id', userData.value.id)
    .order('last_updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(5)

  if (!error && data) {
    recentTranscripts.value = data.map(t => ({
      ...t,
      video_url: t.videos?.video_url || null,
    }))
  }
}

// Open modal for editing a role
const openRoleModal = (role) => {
  editingRole.value = { ...role };
  showRoleModal.value = true;
  roleModalError.value = null;
};

const closeRoleModal = () => {
  editingRole.value = null;
  showRoleModal.value = false;
  roleModalError.value = null;
};

// Save changes to a role
const saveRole = async () => {
  if (!editingRole.value) return;
  roleModalLoading.value = true;
  roleModalError.value = null;
  try {
    const updateData = { ...editingRole.value };
    delete updateData.id;
    delete updateData.created_at;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase.from('roles')
      .update(updateData)
      .eq('id', editingRole.value.id);
    if (error) throw error;

    await getAllRoles();
    closeRoleModal();
    showSuccessAlert.value = true;
    successAlertMessage.value = `Role '${editingRole.value.name}' updated successfully.`;
    setTimeout(() => {
      showSuccessAlert.value = false;
      successAlertMessage.value = '';
    }, 2500);
  } catch (err) {
    roleModalError.value = err.message || 'Failed to update role.';
  } finally {
    roleModalLoading.value = false;
  }
};

// NEW: Functions for creating a new role
const openCreateRoleModal = () => {
  newRole.value = {
    name: '',
    price: 0,
    videos_per_month: 0,
    total_minutes_per_month: 0,
    max_video_duration: 0,
    max_file_size_mb: 0,
    srt_exports_per_month: 0,
    is_admin: false
  };
  showCreateRoleModal.value = true;
  createRoleError.value = null;
};

const closeCreateRoleModal = () => {
  showCreateRoleModal.value = false;
  createRoleError.value = null;
};

const createRole = async () => {
  createRoleLoading.value = true;
  createRoleError.value = null;
  
  try {
    if (!newRole.value.name.trim()) {
      createRoleError.value = 'Role name is required.';
      createRoleLoading.value = false;
      return;
    }

    const insertData = {
      ...newRole.value,
      name: newRole.value.name.trim(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('roles')
      .insert([insertData]);
    
    if (error) {
      if (error.code === '23505') {
        createRoleError.value = 'A role with this name already exists.';
      } else {
        throw error;
      }
      return;
    }

    await getAllRoles();
    closeCreateRoleModal();
    showSuccessAlert.value = true;
    successAlertMessage.value = `Role '${newRole.value.name}' created successfully.`;
    setTimeout(() => {
      showSuccessAlert.value = false;
      successAlertMessage.value = '';
    }, 2500);
  } catch (err) {
    createRoleError.value = err.message || 'Failed to create role.';
  } finally {
    createRoleLoading.value = false;
  }
};

// Role deletion logic
const promptDeleteRole = (role) => {
  roleToDelete.value = role;
  showDeleteRoleModal.value = true;
  deleteRoleError.value = null;
};

const confirmDeleteRole = async () => {
  if (!roleToDelete.value) return;
  deleteRoleLoading.value = true;
  deleteRoleError.value = null;
  
  try {
    const { data: usersWithRole, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('role', roleToDelete.value.id)
      .limit(1);
    
    if (checkError) {
      deleteRoleError.value = 'Error checking role usage.';
      return;
    }
    
    if (usersWithRole && usersWithRole.length > 0) {
      deleteRoleError.value = 'Cannot delete role: it is currently assigned to users.';
      return;
    }

    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleToDelete.value.id);
    
    if (error) {
      deleteRoleError.value = error.message || 'Failed to delete role.';
    } else {
      roles.value = roles.value.filter(r => r.id !== roleToDelete.value.id);
      showDeleteRoleModal.value = false;
      roleToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = `Role '${roleToDelete.value.name}' deleted successfully.`;
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    deleteRoleError.value = err.message || 'Failed to delete role.';
  } finally {
    deleteRoleLoading.value = false;
  }
};

const cancelDeleteRole = () => {
  showDeleteRoleModal.value = false;
  roleToDelete.value = null;
  deleteRoleError.value = null;
};

// Function to get user transcripts
async function getTranscripts() {
  transcriptsLoading.value = true;
  try {
    if (!userData.value?.id) {
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        videos (id, video_url)
      `)
      .eq('user_id', userData.value.id)
      .order('created_at', { ascending: false });
    if (error) {
      return;
    }
    
    userTrans.value = data.map(transaction => ({
      ...transaction,
      video_url: transaction.videos?.video_url || null,
    }));
  } catch (error) {
  } finally {
    transcriptsLoading.value = false;
  }
}

// Updated function to get all users from your custom users table (excluding current user)
async function getAllUsers() {
  if (userData.value?.role !== 'd61d7768-a279-420b-a0ce-b65483794329') {
    return;
  }
  
  allUsersLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`*,
        roles (
          name
          )
        `) 
      .neq('id', userData.value.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    allUsers.value = data || [];
    
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    allUsersLoading.value = false;
  }
}

// Helper function to check if user is admin
const isAdmin = () => {
  return userData.value?.role === 'd61d7768-a279-420b-a0ce-b65483794329';
};

// Helper function to check if a user can be deleted (not admin)
const canDeleteUser = (user) => {
  return user.role !== 'd61d7768-a279-420b-a0ce-b65483794329';
};

// User deletion logic
const promptDeleteUser = (user) => {
  if (!canDeleteUser(user)) {
    return;
  }
  userToDelete.value = user;
  showDeleteUserModal.value = true;
  deleteUserError.value = null;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return;
  deleteUserLoading.value = true;
  deleteUserError.value = null;
  
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.value.id);
    
    if (error) {
      deleteUserError.value = error.message || 'Failed to delete user.';
    } else {
      allUsers.value = allUsers.value.filter(u => u.id !== userToDelete.value.id);
      showDeleteUserModal.value = false;
      userToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = 'User deleted successfully.';
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    deleteUserError.value = err.message || 'Failed to delete user.';
  } finally {
    deleteUserLoading.value = false;
  }
};

const cancelDeleteUser = () => {
  showDeleteUserModal.value = false;
  userToDelete.value = null;
  deleteUserError.value = null;
};

// Deactivate account logic
const promptDeactivate = () => {
  showDeactivateModal.value = true;
  deactivateError.value = null;
};

const confirmDeactivate = async () => {
  deactivateLoading.value = true;
  deactivateError.value = null;
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userData.value.id);

    if (error) {
      deactivateError.value = error.message || 'Failed to deactivate account.';
      return;
    }

    await supabase.auth.signOut();
    router.push('/');

  } catch (err) {
    deactivateError.value = err.message || 'Failed to deactivate account.';
  } finally {
    deactivateLoading.value = false;
  }
};

const cancelDeactivate = () => {
  showDeactivateModal.value = false;
  deactivateError.value = null;
};

// Transaction deletion logic
const promptDelete = (transaction) => {
  transactionToDelete.value = transaction;
  showDeleteModal.value = true;
  deleteError.value = null;
};

const confirmDelete = async () => {
  if (!transactionToDelete.value) return;
  
  const transactionId = transactionToDelete.value.id;
  const videoUrl = transactionToDelete.value.video_url;
  
  deleteLoading.value = true;
  deleteError.value = null;
  
  try {
    if (videoUrl) {
      const url = new URL(videoUrl);
      const pathParts = url.pathname.split('/');
      const videosIndex = pathParts.findIndex(part => part === 'videos');
      
      if (videosIndex > -1 && videosIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(videosIndex + 1).join('/');
        const videoFileName = filePath.split('/').pop(); 
        const baseFileNameOnly = videoFileName.replace(/\.[^/.]+$/, '');

        const filesToDelete = [
          filePath,
          `user-uploads/extractions/${baseFileNameOnly}-transcript.json`,
          `user-uploads/extractions/${baseFileNameOnly}.wav`
        ];

        const { error: storageError } = await supabase.storage
            .from('videos')
            .remove(filesToDelete);

        if (storageError) {
            deleteError.value = `Failed to delete video file: ${storageError.message}`;
            return;
        }
      }
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
      
    if (error) {
      deleteError.value = error.message || 'Fshirja e transkriptit dështoi.';
    } else {
      userTrans.value = userTrans.value.filter(t => t.id !== transactionId);
      showDeleteModal.value = false;
      transactionToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = 'Transkripti u fshi me sukses.';
      setTimeout(() => {
        showSuccessAlert.value = false;
      }, 2500);
      setTimeout(() => {
        successAlertMessage.value = ''; 
      }, 4000);
    }
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete transaction.';
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  transactionToDelete.value = null;
  deleteError.value = null;
};

const checkActiveSubscription = async () => {
  if (!userData.value?.id) return;
  
  try {
    const { data, error } = await supabase
      .from('paypal_subscriptions')
      .select('paypal_subscription_id')
      .eq('user_id', userData.value.id)
      .single();
    
    hasActiveSubscription.value = !error && data;
  } catch (err) {
    hasActiveSubscription.value = false;
  }
};

const promptCancelSubscription = () => {
  showCancelSubscriptionModal.value = true;
  cancelSubscriptionError.value = null;
};

const confirmCancelSubscription = async () => {
  cancelSubscriptionLoading.value = true;
  cancelSubscriptionError.value = null;
  
  try {
    const response = await fetch('https://96b5-31-22-56-9.ngrok-free.app/api/paypal/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userData.value.id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      cancelSubscriptionError.value = result.error || 'Failed to cancel subscription';
      return;
    }

    hasActiveSubscription.value = false;
    showCancelSubscriptionModal.value = false;
    
    await loadUserData();
    
    showSuccessAlert.value = true;
    successAlertMessage.value = 'Subscription cancelled successfully. You have been downgraded to the free plan.';
    setTimeout(() => {
      showSuccessAlert.value = false;
      successAlertMessage.value = '';
    }, 5000);

  } catch (err) {
    cancelSubscriptionError.value = err.message || 'Failed to cancel subscription';
  } finally {
    cancelSubscriptionLoading.value = false;
  }
};

const cancelCancelSubscription = () => {
  showCancelSubscriptionModal.value = false;
  cancelSubscriptionError.value = null;
};

const handleSignOut = async () => {
  await supabase.auth.signOut();
};

onMounted(async () => {
  await loadUserData();
  if (userData.value) {
    await getUserRoleDetails();
    getTranscripts();
    getRecentTranscripts();
    await checkActiveSubscription();
    if (isAdmin()) {
      await getAllUsers();
      await getAllRoles();
    }
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      loadUserData().then(async () => {
        if (userData.value) {
          await getUserRoleDetails();
          getTranscripts();
          if (isAdmin()) {
            getAllUsers();
          }
        }
      });
    } else if (event === 'SIGNED_OUT') {
      userData.value = null;
      userTrans.value = [];
      allUsers.value = [];
      userRoleDetails.value = null;
      router.push('/');
    }
  });
});

defineEmits(['upgrade'])

// Props for dynamic data
const props = defineProps({
  user: {
    type: Object,
    default: () => ({ firstname: '' })
  },
  stats: {
    type: Object,
    default: () => ({
      videosLeft: 3,
      videosTotal: 10,
      minutesLeft: 42,
      minutesTotal: 120
    })
  }
})

// Progress (remaining)
const videoPct = computed(() => {
  const t = Number(userRoleDetails.value?.videos_quota) || 0
  const v = Number(userRoleDetails.value?.videos_remaining) || 0
  if (!t) return 0
  return Math.max(0, Math.min(100, (v / t) * 100))
})
const minutesPct = computed(() => {
  const t = Number(userRoleDetails.value?.seconds_quota) || 0
  const v = Number(userRoleDetails.value?.seconds_remaining) || 0
  if (!t) return 0
  return Math.max(0, Math.min(100, (v / t) * 100))
})

// Dropdown state
const showHelpDropdown = ref(false)
const showProfileDropdown = ref(false)
const helpTrigger = ref(null)
const profileTrigger = ref(null)
let helpTimeout = null
let profileTimeout = null

// Dropdown positions
const helpDropdownStyle = computed(() => {
  if (!helpTrigger.value) return {}
  const rect = helpTrigger.value.getBoundingClientRect()
  return { position: 'fixed', top: `${rect.bottom + 4}px`, right: `${window.innerWidth - rect.right}px`, zIndex: '9999' }
})
const profileDropdownStyle = computed(() => {
  if (!profileTrigger.value) return {}
  const rect = profileTrigger.value.getBoundingClientRect()
  return { position: 'fixed', top: `${rect.bottom + 4}px`, right: `${window.innerWidth - rect.right}px`, zIndex: '9999' }
})

const showEditDropdown = ref(false)
const editTrigger = ref(null)
let editTimeout = null

const editOffsetRightPx = 200
const editDropdownStyle = computed(() => {
  if (!editTrigger.value) return {}
  const rect = editTrigger.value.getBoundingClientRect()
  return {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    right: `${Math.max(8, window.innerWidth - rect.right - editOffsetRightPx)}px`,
    zIndex: '9999'
  }
})

const setFilters = () => {
  showFilters.value = !showFilters.value;
};

// Hover handlers
const handleHelpMouseEnter = () => { if (helpTimeout) clearTimeout(helpTimeout); showHelpDropdown.value = true }
const handleHelpMouseLeave = () => { helpTimeout = setTimeout(() => (showHelpDropdown.value = false), 150) }
const handleProfileMouseEnter = () => { if (profileTimeout) clearTimeout(profileTimeout); showProfileDropdown.value = true }
const handleProfileMouseLeave = () => { profileTimeout = setTimeout(() => (showProfileDropdown.value = false), 150) }
const handleEditMouseEnter = () => {
  if (editTimeout) clearTimeout(editTimeout)
  showEditDropdown.value = true
}
const handleEditMouseLeave = () => {
  editTimeout = setTimeout(() => (showEditDropdown.value = false), 150)
}

const openTranscript = (id) => {
  showEditDropdown.value = false
  goToDetails(id)
}

const openCreate = () => {
  showEditDropdown.value = false
  router.push('/upload')
}

</script>

<style scoped>
.rounded-tab {
  --r: 22px;
  line-height: 1.6;
  border-inline: var(--r) solid #0000;
  border-radius: 0 0 calc(2*var(--r)) calc(2*var(--r))/var(--r);
  mask:
    radial-gradient(var(--r) at var(--r) 100%, #0000 98%, #000 101%) calc(-1*var(--r)) 0/100% var(--r) repeat-x,
    conic-gradient(#000 0 0) padding-box;
  background: white border-box;
  width: fit-content;
}

/* Background grid */
.angled-grid {
  --angle: 35deg;
  --grid-size: 20px;
  --line-opacity: 0.12;
  --line-color: 159, 226, 158;
  background-image:
    repeating-linear-gradient(var(--angle), rgba(var(--line-color), var(--line-opacity)) 0 1px, transparent 1px var(--grid-size)),
    repeating-linear-gradient(calc(var(--angle) + 90deg), rgba(var(--line-color), var(--line-opacity)) 0 1px, transparent 1px var(--grid-size));
  mask-image: linear-gradient(to top right, rgba(0,0,0,0.95), rgba(0,0,0,0.1) 80%, rgba(0,0,0,0));
  -webkit-mask-image: linear-gradient(to top right, rgba(0,0,0,0.95), rgba(0,0,0,0.1) 80%, rgba(0,0,0,0));
}

/* Simple text wipe for "Ngarko" */
.wipe-text { display: inline-block; clip-path: inset(0 100% 0 0); transition: clip-path 260ms ease; }
.group:hover .wipe-text { clip-path: inset(0 0 0 0); transition-delay: 300ms; }

/* Minimal dropdown styles (kept as CSS for portal + animation) */
.dropdown-item {
  display: flex; align-items: center; padding: 10px 14px; color: #052B28; text-decoration: none;
  font-size: 13px; font-family: 'Poppins', sans-serif; transition: all 0.2s ease; border-radius: 8px; margin: 2px 8px 0 0;
}
.dropdown-item:hover { background: #052b2810; color: #052b28; transform: translateX(2px); }
.dropdown-divider { height: 1px; background: rgba(52, 52, 52, 0.2); margin: 8px 16px; }
</style>

<style>
.dropdown-menu-portal {
  min-width: 200px;
  background: rgba(255, 255, 255, 0.772);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(31, 31, 31, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(-10px);
  animation: dropdownFadeIn 0.2s ease-out forwards;
  padding: 4px 0;
}

.dropdown-menu-portal::after { content: ''; position: absolute; top: -8px; left: 0; right: 0; height: 8px; background: transparent; }
@keyframes dropdownFadeIn { to { opacity: 1; transform: translateY(0); } }
</style>