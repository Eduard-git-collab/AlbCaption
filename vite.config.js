import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    compilerOptions: {
          isCustomElement: (tag) => tag === 'wistia-player'
        }
  }), tailwindcss()],
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    allowedHosts: [
      'f588-95-107-209-153.ngrok-free.app',
      'albcaptions.com',
      'www.albcaptions.com',
      'localhost'
    ]
  }
})