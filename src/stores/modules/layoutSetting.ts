import { reactive, computed, watchPostEffect } from 'vue';
import { theme } from 'ant-design-vue';
import { defineStore } from 'pinia';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';

const { defaultAlgorithm, darkAlgorithm } = theme;

/** 主题色 */
export const themeColor = {
  light: defaultAlgorithm,
  dark: defaultAlgorithm,
  realDark: darkAlgorithm,
} as const;
export type ThemeColor = keyof typeof themeColor;

export type LayoutSetting = {
  navTheme: ThemeColor; // theme for nav menu
  colorPrimary: string; // '#F5222D',
  layout: 'sidemenu' | 'topmenu';
  contentWidth: 'Fluid' | 'Fixed'; // only works when layout is topmenu
  fixedHeader: false; // sticky header
  fixSiderbar: false; // sticky siderbar
  colorWeak: false;
  menu: {
    locale: true;
  };
  title: string;
  pwa: false;
  iconfontUrl: string;
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
};

export const defaultSetting: LayoutSetting = {
  navTheme: 'dark', // theme for nav menu
  colorPrimary: '#1677FF', // '#F5222D', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'vite-antdv-admin',
  pwa: false,
  iconfontUrl: '',
  // production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
};

export const useLayoutSettingStore = defineStore('layoutSetting', () => {
  const layoutSetting = reactive({ ...defaultSetting });
  const themeConfig = reactive<ThemeConfig>({
    algorithm: themeColor[layoutSetting.navTheme!] || defaultAlgorithm,
    token: {
      colorPrimary: layoutSetting.colorPrimary,
    },
  });

  const getNavTheme = computed(() => {
    return layoutSetting.navTheme;
  });

  watchPostEffect(() => {
    if (layoutSetting.navTheme) {
      toggleTheme(layoutSetting.navTheme);
    }
    if (layoutSetting.colorPrimary) {
      setColorPrimary(layoutSetting.colorPrimary);
    }
    // 修改项目配置时自动同步到 localStorage
    // Storage.set(THEME_KEY, layoutSetting);
  });

  // 切换主题
  const toggleTheme = (navTheme: ThemeColor) => {
    if (navTheme === 'realDark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    themeConfig.algorithm = themeColor[navTheme];
  };

  /** 设置主题色 */
  const setColorPrimary = (color: string) => {
    themeConfig.token!.colorPrimary = color;
  };

  const updateLayoutSetting = (settings: Partial<LayoutSetting>) => {
    Object.assign(layoutSetting, settings);
  };

  return {
    layoutSetting,
    themeConfig,
    getNavTheme,
    toggleTheme,
    setColorPrimary,
    updateLayoutSetting,
  };

})

