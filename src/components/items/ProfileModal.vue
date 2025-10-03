<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
        @keydown.esc.prevent="close"
        @click.self="close"
      >
        <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
          <div
            ref="panelRef"
            class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-primary/10"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white/90 backdrop-blur px-5 md:px-6 py-4 border-b border-primary/10 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 class="text-lg md:text-xl font-semibold text-primary font-poppins">Profili im</h2>
                <p class="text-sm text-primary/70 font-poppins">Menaxhoni të dhenat e profilit</p>
              </div>
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-primary hover:bg-primary/5 transition"
                @click="close"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-5 md:px-6 py-4 font-poppins">
              <!-- Profile picture -->
              <section class="py-4">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                  <div class="flex items-center gap-4">
                    <img
                      :src="avatarPreview || defaultAvatar"
                      class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-1 ring-primary/10"
                      alt="Profile picture"
                    />
                    <div>
                      <p class="text-sm text-primary font-medium">Foto Profili</p>
                      <span class="text-xs text-primary/60 flex items-center gap-1">PNG, JPG <p class="text-[8px]">(5MB)</p></span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
                    <button
                      type="button"
                      class="px-3 py-1.5 text-sm bg-white border border-primary/15 rounded-md shadow-sm hover:bg-primary/5 transition"
                      @click="fileInput?.click()"
                      :disabled="busy"
                    >
                      Ngarko foton tënde
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1.5 text-sm bg-white border border-red-200 text-red-600 rounded-md shadow-sm hover:bg-red-50 transition"
                      @click="removeAvatar"
                      :disabled="busy || !avatarPreview"
                    >
                      Fshi
                    </button>
                  </div>
                </div>
              </section>

              <hr class="my-4 border-primary/10" />

              <!-- Full name -->
              <section class="py-2">
                <p class="text-sm font-medium text-primary mb-3">Emri i plotë</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-primary/70 mb-1">Emër</label>
                    <input
                      v-model.trim="form.firstName"
                      type="text"
                      class="w-full rounded-md bg-white border border-primary/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 px-3 py-2 text-sm text-primary outline-none"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-primary/70 mb-1">Mbiemër</label>
                    <input
                      v-model.trim="form.lastName"
                      type="text"
                      class="w-full rounded-md bg-white border border-primary/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 px-3 py-2 text-sm text-primary outline-none"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </section>

              <hr class="my-4 border-primary/10" />
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <label class="block text-xs text-primary/70 mb-1">Email</label>
                      <div class="flex items-center gap-2">
                        <div class="inline-flex items-center justify-center w-8 h-9 rounded-md border border-primary/15 bg-white text-primary/70">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M12 14v7"/>
                          </svg>
                        </div>
                        <input
                          v-model.trim="form.email"
                          type="email"
                          class="flex-1 rounded-md bg-white border border-primary/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 px-3 py-2 text-sm text-primary outline-none"
                          placeholder="you@example.com"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              <hr class="my-4 border-primary/10" />

              <!-- Password -->
              <section class="py-2">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-medium text-primary">Password</p>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-white border border-primary/15 rounded-md shadow-sm hover:bg-primary/5 transition"
                    @click="changePassword"
                    :disabled="busy"
                  >
                    Ndrysho password
                  </button>
                </div>
                <p class="text-xs text-primary/70 mb-2">
                  <span>Do t’ju dërgojmë një link për ndryshimin e password-it në emailin tuaj.</span>
                </p>
              </section>
            </div>

            <!-- Footer -->
            <div class="px-5 md:px-6 py-4 border-t border-primary/10 rounded-b-2xl flex items-center justify-between">
              <p v-if="status" class="text-xs text-primary/70">{{ status }}</p>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm bg-white border border-primary/15 rounded-md hover:bg-primary/5 transition"
                  @click="close"
                  :disabled="busy"
                >
                  Anulo
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm bg-secondary text-primary rounded-md ring-1 ring-primary/10 hover:bg-[#7dd87b] transition"
                  @click="save"
                  :disabled="busy"
                >
                  <span v-if="busy">Duke ruajtur...</span>
                  <span v-else>Ruaj</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '../../lib/supabaseClient'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open', 'saved'])

const panelRef = ref(null)
const fileInput = ref(null)

const busy = ref(false)
const status = ref('')
const errors = reactive({ password: '' })

const defaultAvatar =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" rx="80" ry="80" fill="#E5F6E5"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="64" fill="#12998e">👤</text></svg>`)

const sessionUser = ref(null)
const dbUser = ref(null)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  extraEmails: []
})

const pwd = reactive({ current: '', new: '' }) // kept for potential direct-change flow
const show = reactive({ current: false, new: false })

const avatarPreview = ref('')    // public URL or data URL
const avatarPath = ref('')       // storage path we saved to (for deletion)

// You can centralize this if you prefer:
const siteUrl = window.location.origin
const passwordRedirectTo = `${siteUrl}/auth/reset-password`
const emailRedirectTo = `${siteUrl}/auth/reset-password` // can be a generic /auth/callback too

/* Load current user + profile from DB */
async function loadUser() {
  const { data: { session } } = await supabase.auth.getSession()
  sessionUser.value = session?.user || null
  if (!sessionUser.value) return

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionUser.value.id)
    .single()

  if (!error && data) {
    dbUser.value = data
    form.firstName = data.name || ''
    form.lastName = data.surname || ''
    form.email = sessionUser.value.email || ''
    avatarPreview.value = data.avatar_url || ''
    avatarPath.value = data.avatar_path || ''
  }
}

/* Save profile core fields */
async function saveProfileCore() {
  if (!dbUser.value) return
  const payload = {
    name: form.firstName,
    surname: form.lastName
  }
  const { error } = await supabase.from('users').update(payload).eq('id', dbUser.value.id)
  if (error) throw error
}

/* OPTIONAL: Direct password change (kept, but UI uses email link instead) */
async function savePasswordIfNeeded() {
  errors.password = ''
  if (!pwd.current && !pwd.new) return
  if (!pwd.current || !pwd.new) {
    errors.password = 'Both current and new password are required.'
    throw new Error('Password validation failed')
  }
  const { data: { session } } = await supabase.auth.getSession()
  const email = session?.user?.email
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: pwd.current })
  if (signInError) {
    errors.password = 'Current password is incorrect.'
    throw signInError
  }
  const { error: updateError } = await supabase.auth.updateUser({ password: pwd.new })
  if (updateError) throw updateError
}

/* Send password reset email */
async function changePassword() {
  if (busy.value) return
  busy.value = true
  status.value = 'Duke dërguar emailin e rikuperimit...'
  try {
    const email = sessionUser.value?.email
    if (!email) throw new Error('Nuk u gjet emaili i përdoruesit.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: passwordRedirectTo
    })
    if (error) throw error
    status.value = 'Linku për ndryshimin e password-it u dërgua në emailin tuaj.'
  } catch (err) {
    status.value = err.message || 'Dërgimi i emailit dështoi.'
  } finally {
    busy.value = false
  }
}

/* Request email change (sends confirmation email(s)) */
async function promptAndChangeEmail() {
  if (busy.value) return
  const newEmail = window.prompt('Shkruani emailin e ri:')
  if (!newEmail) return
  busy.value = true
  status.value = 'Duke dërguar konfirmimin e emailit...'
  try {
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo }
    )
    if (error) throw error
    // If "Secure email change" is enabled in Supabase, emails go to both old and new addresses.
    status.value = 'Dërguam një email konfirmimi për ndryshimin e emailit. Ju lutemi kontrolloni emailin tuaj.'
  } catch (err) {
    status.value = err.message || 'Ndryshimi i emailit dështoi.'
  } finally {
    busy.value = false
  }
}

/* Avatar upload/remove */
async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file || !sessionUser.value) return
  if (file.size > 5 * 1024 * 1024) {
    status.value = 'Fotoja është më e madhe se limiti (max 5MB).'
    return
  }
  busy.value = true
  status.value = 'Duke ngarkuar...'
  try {
    const ext = file.name.split('.').pop()
    const path = `avatars/${sessionUser.value.id}-${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) throw upErr

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: updErr } = await supabase
      .from('users')
      .update({ avatar_url: pub.publicUrl, avatar_path: path })
      .eq('id', sessionUser.value.id)
    if (updErr) throw updErr

    avatarPreview.value = pub.publicUrl
    avatarPath.value = path
    status.value = 'Fotoja u përditsua.'
  } catch (err) {
    status.value = err.message || 'Përditsimi dështoi.'
  } finally {
    busy.value = false
    fileInput.value.value = ''
  }
}

async function removeAvatar() {
  if (!avatarPath.value) {
    avatarPreview.value = ''
    return
  }
  busy.value = true
  status.value = 'Duke fshir...'
  try {
    await supabase.storage.from('avatars').remove([avatarPath.value])
    await supabase.from('users').update({ avatar_url: null, avatar_path: null }).eq('id', sessionUser.value.id)
    avatarPreview.value = ''
    avatarPath.value = ''
    status.value = 'Fotoja u fshi.'
  } catch (err) {
    status.value = err.message || 'Fshirja dështoi.'
  } finally {
    busy.value = false
  }
}

/* Save all */
async function save() {
  busy.value = true
  status.value = 'Duke përditsuar...'
  try {
    await saveProfileCore()
    await savePasswordIfNeeded() // no-op unless you add inputs for direct change
    status.value = 'Përditsim i sukseshëm!'
    emit('saved')
    setTimeout(() => {
      status.value = ''
      close()
    }, 900)
  } catch (err) {
    status.value = err.message || 'Përditsimi dështoi.'
  } finally {
    busy.value = false
  }
}

function addExtraEmail() {
  form.extraEmails.push('')
}

function close() {
  emit('update:open', false)
}

/* Lifecycle */
watch(
  () => props.open,
  async (val) => {
    if (val) {
      status.value = ''
      errors.password = ''
      pwd.current = ''
      pwd.new = ''
      await loadUser()
      requestAnimationFrame(() => {
        panelRef.value?.focus?.()
      })
    }
  },
  { immediate: false }
)

function onKeyDown(e) {
  if (e.key === 'Escape' && props.open) close()
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>