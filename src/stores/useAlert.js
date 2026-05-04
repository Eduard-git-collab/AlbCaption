import { reactive } from 'vue'

const state = reactive({
  show: false,
  title: '',
  message: '',
  bgColor: '',
  borderColor: '',
  textColor: '',
  logoColorClass: ''
})

export function useAlert() {
  const showAlert = (type, message) => {
    state.show = true
    
    const configs = {
      success: {
        title: 'Sukses',
        bgColor: '#D9F3D8',
        borderColor: '#16a34a',
        textColor: '#16a34a',
        logoColorClass: 'text-green-600'
      },
      warning: {
        title: 'Kujdes',
        bgColor: '#F1E8CF',
        borderColor: '#E5CB89',
        textColor: '#E5CB89',
        logoColorClass: 'text-yellow-500'
      },
      error: {
        title: 'Rrezik',
        bgColor: '#FED1D1',
        borderColor: '#EA4F4F',
        textColor: '#EA4F4F',
        logoColorClass: 'text-red-500'
      }
    }

    const config = configs[type] || configs.error
    state.title = config.title
    state.message = message
    state.bgColor = config.bgColor
    state.borderColor = config.borderColor
    state.textColor = config.textColor
    state.logoColorClass = config.logoColorClass
  }

  const closeAlert = () => {
    state.show = false
  }

  return { state, showAlert, closeAlert }
}