import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElectronDevPlugin } from './plugins/vite.electron.dev'
import { ElectronBuildPlugin } from './plugins/vite.electron.build'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

const APP_PLUGINS = () => {
  return [ElectronDevPlugin(), ElectronBuildPlugin()]
}
const IS_APP = process.env.IS_APP
const IS_DEV = process.env.NODE_ENV === 'development'
const pluginsList = IS_APP ? APP_PLUGINS() : []

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    vueJsx(), 
    ...pluginsList,
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  // base: './',
  base:  IS_DEV ? '/' : './',
  css: {
    modules: {},
    preprocessorOptions: {
      // scss: {
      //   // additionalData: '@import "@/assets/themes/mixin.scss";'
      // },
      less: {
        javascriptEnabled: true,
        modifyVars: {},
        additionalData: `
          @primary-color: #00b96b; 
          @header-height: 60px; 
        `,
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://nest-api.buqiyuan.site/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws-api': {
        target: 'wss://nest-api.buqiyuan.site',
        changeOrigin: true, //是否允许跨域
        ws: true
      }
    }
  },
  optimizeDeps: {
    include: [
      'ant-design-vue/es/locale/zh_CN',
      'ant-design-vue/es/locale/en_US',
    ],
  },
  build: {
    target: 'es2017',
    minify: 'esbuild',
    cssTarget: 'chrome79',
    chunkSizeWarningLimit: 2000,
  },
})
