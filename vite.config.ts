import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElectronDevPlugin } from './plugins/vite.electron.dev'
import { ElectronBuildPlugin } from './plugins/vite.electron.build'

const APP_PLUGINS = () => {
  return [
    ElectronDevPlugin(), 
    ElectronBuildPlugin()
  ]
}
const IS_APP = process.env.IS_APP
const IS_DEV = process.env.NODE_ENV === 'development'
const pluginsList =  IS_APP ? APP_PLUGINS() : []

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ...pluginsList,
  ],
  base:  IS_DEV ? '/' : './',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/themes/mixin.scss";'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
