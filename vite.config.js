import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path'

export default defineConfig({
  plugins: [
    vue({
      compilerOptions: {
        isCustomElement: (tag) => tag === 'wistia-player',
      },
    }),
    tailwindcss({
      config: path.resolve(__dirname, './tailwind.config.js'),
    }),
  ],
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    allowedHosts: [
      'bc70-95-107-189-202.ngrok-free.app',
      'hosted-lawyer-liked-alleged.trycloudflare.com',
      'selection-alive-integral-beds.trycloudflare.com',
      'albcaptions.com',
      'www.albcaptions.com',
      'localhost',
    ],
  },
})