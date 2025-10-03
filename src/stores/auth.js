import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: true,
    session: null,
    user: null,         
    profile: null,      
    error: null,
  }),
  getters: {
    isAuthed: (s) => !!s.user,
    userId: (s) => s.user?.id ?? null,
    roleId: (s) => s.profile?.role ?? null,
    roleName: (s) => s.profile?.roles?.name ?? null,
    isAdmin: (s) => s.profile?.role === 'd61d7768-a279-420b-a0ce-b65483794329', 
  },
  actions: {
    async init() {
      this.loading = true
      this.error = null
      try {
        const { data: { session } } = await supabase.auth.getSession()
        this.session = session
        this.user = session?.user ?? null
        if (this.user) {
          await this.fetchProfile()
        } else {
          this.profile = null
        }

        supabase.auth.onAuthStateChange(async (_event, session) => {
          this.session = session
          this.user = session?.user ?? null
          if (this.user) {
            await this.fetchProfile()
          } else {
            this.profile = null
          }
        })
      } catch (e) {
        this.error = e.message || String(e)
      } finally {
        this.loading = false
      }
    },
    async fetchProfile() {
      if (!this.user?.id) {
        this.profile = null
        return
      }
      const { data, error } = await supabase
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
        .eq('id', this.user.id)
        .single()

      if (error || !data) {
        this.profile = null
        this.error = error?.message || 'User profile not found'
        return
      }

      // sanity checks like you do in components are optional here
      this.profile = { ...data, email: this.user.email }
    },
    async signOut() {
      await supabase.auth.signOut()
      this.session = null
      this.user = null
      this.profile = null
    }
  },
})