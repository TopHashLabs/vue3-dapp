import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'unplugin-vue-components/vite'

export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [vue({ reactivityTransform: true }), ViteComponents()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    // @ts-ignore
    allowNodeBuiltins: ['stream']
  }
})
