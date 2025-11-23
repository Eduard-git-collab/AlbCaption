/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      // This will now cover 1024px up to 1439px (including your 1280px target)

      'xl': '1440px', 
      // => @media (min-width: 1440px) { ... }
      // Reserved for desktop monitors

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
    extend: {
      colors: {
      },
    }
  },
  plugins: [],
}