import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: true,
    initializing: false,
    session: null,
    user: null,         
    profile: null,      
    error: null,
    authSubscription: null,
  }),
  getters: {
    isAuthed: (s) => !!s.user && !s.loading,
    userId: (s) => s.user?.id ?? null,
    roleId: (s) => s.profile?.role ?? null,
    roleName: (s) => s.profile?.roles?.name ?? null,
    isAdmin: (s) => s.profile?.role === 'd61d7768-a279-420b-a0ce-b65483794329',
    userEmail: (s) => s.user?.email ?? null,
    userName: (s) => s.profile?.name ?? s.user?.user_metadata?.name ?? null,
    userSurname: (s) => s.profile?.surname ?? s.user?.user_metadata?.surname ?? null,
    fullName: (s) => {
      const name = s.profile?.name ?? s.user?.user_metadata?.name ?? ''
      const surname = s.profile?.surname ?? s.user?.user_metadata?.surname ?? ''
      return [name, surname].filter(Boolean).join(' ') || 'Anonymous'
    },
  },
  actions: {
    async init() {
      if (this.initializing) return // Prevent multiple initializations
      
      this.initializing = true
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

        // Set up auth state listener (only once)
        if (!this.authSubscription) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', event)
            this.session = session
            this.user = session?.user ?? null
            
            if (this.user) {
              await this.fetchProfile()
            } else {
              this.profile = null
            }
            this.loading = false
          })
          this.authSubscription = subscription
        }
      } catch (e) {
        this.error = e.message || String(e)
        console.error('Auth store init error:', e)
      } finally {
        this.loading = false
        this.initializing = false
      }
    },

    async fetchProfile() {
      if (!this.user?.id) {
        this.profile = null
        return
      }
      
      try {
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

        this.profile = { ...data, email: this.user.email }
      } catch (e) {
        console.error('Error fetching profile:', e)
        this.error = e.message || 'Failed to fetch profile'
      }
    },

    async signOut() {
      try {
        await supabase.auth.signOut()
        this.session = null
        this.user = null
        this.profile = null
        this.error = null
      } catch (e) {
        console.error('Sign out error:', e)
        this.error = e.message || 'Failed to sign out'
      }
    },

    clearError() {
      this.error = null
    },

    destroy() {
      if (this.authSubscription) {
        this.authSubscription.unsubscribe()
        this.authSubscription = null
      }
    }
  },
})