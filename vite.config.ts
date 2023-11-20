import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import checker from 'vite-plugin-checker';
import { viteMockServe } from 'vite-plugin-mock';
import Unocss from 'unocss/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { ElectronDevPlugin } from './plugins/vite.electron.dev'
import { ElectronBuildPlugin } from './plugins/vite.electron.build'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import dayjs from 'dayjs';
import pkg from './package.json';
import type { UserConfig, ConfigEnv } from 'vite';
import { nprogressPlugin } from '@vuepress/plugin-nprogress'

const CWD = process.cwd();
const APP_PLUGINS = () => {
  return [ElectronDevPlugin(), ElectronBuildPlugin()]
}
const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

const IS_APP = process.env.IS_APP
const IS_DEV = process.env.NODE_ENV === 'development'
const pluginsList = IS_APP ? APP_PLUGINS() : []

// https://vitejs.dev/config/
export default defineConfig(({ command, mode}: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);

  const isBuild = command === 'build';

  return {
  base:  IS_DEV ? '/' : './',
  define: {
    __APP_INFO__: JSON.stringify(__APP_INFO__),
  },
  plugins: [
    vue(), 
    vueJsx(), 
    Unocss(),
    ...pluginsList,
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [resolve(CWD, 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'svg-icon-[dir]-[name]',
    }),
    // enable?: boolean;
    // logger?: boolean;
    viteMockServe({
      ignore: /^_/,
      mockPath: 'mock',
      enable: !isBuild,
      logger: true,
    }),
    Components({
      dts: 'types/components.d.ts',
      types: [
        {
          from: './src/components/basic/button/',
          names: ['AButton'],
        },
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
          exclude: ['Button'],
        }),
      ],
    }),
  ],
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
      '@vue/runtime-core',
      '@vue/shared',
      'lodash-es',
      'ant-design-vue/es/locale/zh_CN',
      'ant-design-vue/es/locale/en_US',
    ],
  },
  // esbuild: {
  //   pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
  //   supported: {
  //     // https://github.com/vitejs/vite/pull/8665
  //     'top-level-await': true,
  //   },
  // },
  build: {
    target: 'es2017',
    minify: 'esbuild',
    cssTarget: 'chrome79',
    chunkSizeWarningLimit: 2000,
  },
}
})
