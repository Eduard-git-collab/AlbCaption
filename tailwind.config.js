/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F5EB',
        tan: {
          DEFAULT: '#EDE6D4',
          '+1': '#DBD1B7',
          '+2': '#C8BC9B',
          '+3': '#ADA17F'
        },
        avocado: {
          '-1': '#D5D372',
          DEFAULT: '#A29E47',
          '+1': '#7D7B30',
          '+2': '#666522'
        },
        lavender: {
          DEFAULT: '#EAE4E9',
          '+1': '#D8C6D5',
          '+2': '#C7B1C3'
        },
        mint: {
          DEFAULT: '#D8E6D5',
          '+1': '#BDCFB7',
          '+2': '#ADC6A5'
        },
        rust: {
          '-2': '#FFC7B1',
          '-1': '#F19E7D',
          DEFAULT: '#E17043',
          '+1': '#BD5333'
        },
        charcoal: {
          '-2': '#B6B6B6',
          '-1': '#888988',
          DEFAULT: '#666666',
          '+1': '#3F4240'
        }
      }
    }
  },
  plugins: [],
}