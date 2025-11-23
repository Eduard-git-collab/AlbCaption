<template>
  <div class="w-full min-h-screen bg-primary overflow-y-auto overflow-x-hidden">
    <div class="w-full h-full relative flex flex-col">
      <!-- Background SVG lines -->
      <div class="fixed bottom-0 left-0 z-0 w-full h-full pointer-events-none">
        <div class="w-full h-full flex items-end lg:block">
          <logo_lines class="h-1/2 w-full pointer-events-none text-secondary/10" />
        </div>
      </div>

      <!-- Main content -->
      <div class="relative z-10 w-full flex-grow flex justify-center items-center py-12 px-4">
        <div class="w-full max-w-3xl text-secondary flex flex-col items-center lg:items-start text-center lg:text-left">
          
            <!-- Loading -->
            <template v-if="!ready">
              <div class="text-kollektif-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mt-2">
                Po verifikojmë linkun…
              </div>
              <p class="font-poppins text-lg sm:text-xl md:text-2xl lg:text-2xl font-normal mt-4 opacity-90">
                Ju lutemi prisni një moment.
              </p>
            </template>

            <!-- Invalid/Expired -->
            <template v-else-if="isInvalid">
              <div class="text-kollektif-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none text-red-400">Link i pavlefshëm</div>
              <h1 class="text-kollektif-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mt-4">
                Linku i email-it ka skaduar ose është i pavlefshëm
              </h1>
              <p class="font-poppins text-lg sm:text-xl font-normal mt-4 opacity-90 max-w-2xl">
                {{ errorMessage || 'Përdorni "Harrove fjalëkalimin?" për të kërkuar një link të ri rikuperimi.' }}
              </p>
              <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <router-link
                  to="/signin"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary text-primary px-8 py-3.5 font-poppins font-medium hover:bg-white transition-colors"
                >
                  Shko te hyrja
                </router-link>
                <a
                  href="mailto:hello@albcaptions.com"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-8 py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Na kontakto
                </a>
              </div>
            </template>

            <!-- Valid -->
            <template v-else>
              <div class="text-kollektif-bold text-4xl sm:text-6xl md:text-7xl leading-none">Rivendos fjalëkalimin</div>
              <h2 class="text-kollektif-bold text-2xl sm:text-3xl leading-tight mt-4">
                Vendosni fjalëkalimin e ri
              </h2>
              <p class="font-poppins text-lg sm:text-xl font-normal mt-2 opacity-90">
                Ju lutemi zgjidhni një fjalëkalim të sigurt (min 8 karaktere).
              </p>

              <form class="mt-8 w-full max-w-xl lg:mx-0 mx-auto" @submit.prevent="submit">
                <div class="space-y-4">
                  <input
                    v-model.trim="newPassword"
                    type="password"
                    minlength="8"
                    required
                    class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-4 text-white placeholder:text-white/60 outline-none transition-all"
                    placeholder="Fjalëkalim i ri"
                  />
                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center rounded-full bg-secondary text-primary px-8 py-3.5 font-poppins font-medium hover:bg-white transition-colors disabled:opacity-60 shadow-lg shadow-secondary/10"
                    :disabled="busy"
                  >
                    <span v-if="busy">Duke ruajtur…</span>
                    <span v-else>Ruaj fjalëkalimin</span>
                  </button>
                </div>

                <p v-if="status" class="font-poppins text-base mt-4 opacity-90 text-center lg:text-left">
                  {{ status }}
                </p>

                <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <router-link
                    to="/signin"
                    class="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-8 py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Kthehu te hyrja
                  </router-link>
                </div>
              </form>
            </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import logo_lines from '../logos/Logo_lines.vue'

const newPassword = ref('')
const busy = ref(false)
const status = ref('')

const ready = ref(false)
const isInvalid = ref(false)
const errorMessage = ref('')

// Helper: read from both hash and query
function getParam(name) {
  const url = new URL(window.location.href)
  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash
  const hp = new URLSearchParams(hash)
  const qp = url.searchParams
  return hp.get(name) || qp.get(name)
}

function cleanHash() {
  history.replaceState({}, document.title, window.location.pathname + window.location.search)
}

async function waitForSession(maxTries = 10, delayMs = 100) {
  for (let i = 0; i < maxTries; i++) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) return session
    await new Promise(r => setTimeout(r, delayMs))
  }
  return null
}

onMounted(async () => {
  try {
    // 1) If Supabase returned an explicit error
    const explicitError = getParam('error') || getParam('error_code') || getParam('error_description')
    if (explicitError) {
      isInvalid.value = true
      errorMessage.value = decodeURIComponent(getParam('error_description') || 'Email link është i pavlefshëm ose ka skaduar.')
      ready.value = true
      return
    }

    // 2) Establish session from access_token/refresh_token or code
    const at = getParam('access_token')
    const rt = getParam('refresh_token')
    const code = getParam('code')

    if (at && rt) {
      const { error } = await supabase.auth.setSession({ access_token: at, refresh_token: rt })
      if (error) {
        isInvalid.value = true
        errorMessage.value = error.message || 'Seanca e rikuperimit nuk mund të krijohet.'
        ready.value = true
        return
      }
      cleanHash()
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        isInvalid.value = true
        errorMessage.value = error.message || 'Seanca e rikuperimit nuk mund të krijohet.'
        ready.value = true
        return
      }
      cleanHash()
    } else {
      // 3) No params in URL. Supabase client might auto-detect; wait briefly.
      const session = await waitForSession()
      if (!session) {
        isInvalid.value = true
        errorMessage.value = 'Kjo faqe mund të hapet vetëm nga linku i rikuperimit të dërguar me email.'
        ready.value = true
        return
      }
    }
  } catch (e) {
    console.error('Reset password error:', e)
    isInvalid.value = true
    errorMessage.value = e.message || 'Gabim gjatë verifikimit të linkut.'
  } finally {
    ready.value = true
  }
})

async function submit() {
  if (busy.value) return
  busy.value = true
  status.value = 'Duke përditësuar fjalëkalimin…'
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword.value })
    if (error) throw error
    status.value = 'Fjalëkalimi u përditësua me sukses. Mund të hyni me fjalëkalimin e ri.'
  } catch (err) {
    console.error('Password update error:', err)
    status.value = err.message || 'Përditësimi dështoi. Hapni sërish linkun nga emaili.'
  } finally {
    busy.value = false
  }
}
</script>