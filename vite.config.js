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
    strictPort: true,
    allowedHosts: [
      'albcaptions.com',
      'www.albcaptions.com',
      'localhost',
    ],
  },
})