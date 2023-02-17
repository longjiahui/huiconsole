import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default {
  plugins: [vue()],
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
}