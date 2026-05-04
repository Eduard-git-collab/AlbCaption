import { reactive } from 'vue'

const state = reactive({
  show: false,
  type: 'info',
  title: '',
  message: '',
  resolve: null,
  approve: '',
  reject: '',

  // styles
  iconWrapper: '',
  iconColor: '',
  logoColor: '',
  textColor: '',
  buttonColor: ''
})

export function useConfirm() {
  const configs = {
    error: {
      title: 'Rrezik',
      iconWrapper: 'w-12 h-12 rounded-full bg-red-300 flex items-center justify-center',
      logoColor: 'text-red-500',
      textColor: 'text-red-500',
      buttonColor: 'bg-red-500 hover:bg-red-400'
    },
    warning: {
      title: 'Kujdes',
      iconColor: 'text-[#E5CC89]',
      logoColor: 'text-[#E5CC89]',
      textColor: 'text-[#E5CC89]',
      buttonColor: 'bg-[#E5CC89] hover:bg-[#E5CC89]/90'
    },
    info: {
      title: 'Info',
      iconWrapper: 'w-12 h-12 rounded-md bg-secondary flex items-center justify-center',
      logoColor: 'text-primary',
      textColor: 'text-primary',
      buttonColor: 'bg-primary hover:bg-primary/90'
    }
  }

  const showConfirm = (type, message, approve = '', reject = '') => {
    return new Promise((resolve) => {
      const config = configs[type] || configs.info

      Object.assign(state, {
        show: true,
        type,
        message,
        approve,
        reject,
        resolve,
        ...config
      })
    })
  }

  const confirm = () => {
    state.show = false
    state.resolve?.(true)
  }

  const cancel = () => {
    state.show = false
    state.resolve?.(false)
  }

  return { state, showConfirm, confirm, cancel }
}