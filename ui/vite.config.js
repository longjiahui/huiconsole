import { defineConfig, mergeConfig } from 'vite'
import defaultConfig from './vite.base.config'

// https://vitejs.dev/config/
export default defineConfig(
  mergeConfig(defaultConfig, {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:7001',
        }
      }
    }
  })
)
