import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: true,
    session: null,
    user: null,
    token: null,
    error: null,
  }),
  
  getters: {
    isAuthed: (s) => !!s.user && !!s.token,
    userId: (s) => s.user?.id ?? null,
    userEmail: (s) => s.user?.email ?? null,
    getToken: (s) => s.session?.access_token ?? null,
  },
  
  actions: {
    async init() {
      this.loading = true
      this.error = null
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        this.session = session
        this.user = session?.user ?? null
        this.token = session?.access_token ?? null
      } catch (e) {
        this.error = e.message || String(e)
        console.error('Auth  store init error:', e)
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        this.session = data.session
        this.user = data.user
        this.token = data.session?.access_token ?? null
        
        return { success: true, user: data.user }
      } catch (e) {
        this.error = e.message || String(e)
        console.error('Login error:', e)
        return { success: false, error: e.message }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        await supabase.auth.signOut()
        this.session = null
        this.user = null
        this.token = null
        this.error = null
      } catch (e) {
        console.error('Sign out error:', e)
        this.error = e.message || 'Failed to sign out'
      }
    },

    getToken() {
      return this.token
    },

    clearError() {
      this.error = null
    }
  },
})