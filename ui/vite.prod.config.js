import { defineConfig, mergeConfig } from 'vite'
import defaultConfig from './vite.base.config'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(
  mergeConfig(defaultConfig, {
    plugins: [viteCompression()],
  })
)
