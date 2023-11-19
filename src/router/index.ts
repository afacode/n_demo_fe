import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import type { Router, RouteLocationNormalized } from 'vue-router';
import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import storage from '@/plugins/utils/storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
import {to as _to} from '@/plugins/utils/awaitTo';
import RouterView from '@/layout/index.vue';
// import RouterView from '@/layout/index.vue';
// 路由白名单
export const whiteNameList = ['Login', 'icons', 'error', 'error-404'] as const; // no redirect whitelist

export type WhiteNameList = typeof whiteNameList;

export type WhiteName = (typeof whiteNameList)[number];

export const outsideLayout: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/welcome',
    component: RouterView,
    meta: {
      title: 'dashboard',
      icon: 'icon-yibiaopan',
    },
    children: [
      {
        path: 'welcome',
        name: `dashboard-welcome`,
        meta: {
          title: 'welcome',
          icon: 'icon-shouye',
        },
        component: () =>
          import(/* webpackChunkName: "dashboard-welcome" */ '@/views/dashboard/welcome/index.vue'),
      },
    ],
  },
]

export const routes: Array<RouteRecordRaw>= [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard/welcome',
    component: Layout,
    meta: {
      title: '首页',
    },
    children: [],
  },
  ...outsideLayout
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => {
    return { left: 0, top: 0 };
  },
})



export const baseRouter: Array<RouteRecordRaw> = [
  {
    path: '/about',
    meta: {
      title: 'level',
      icon: 'EditOutlined',
      hideInMenu: true,
      hideInTabs: true,
    },
    component: () => import('@/views/AboutView.vue')
  }
]

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !whiteNameList.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
createRouterGuards(router, whiteNameList)

const defaultRoutePath = '/dashboard/welcome';
export const LOGIN_NAME = 'Login';
export function createRouterGuards(router: Router, whiteNameList: WhiteNameList) {

  router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore();
    const token = storage.getStorage(ACCESS_TOKEN_KEY, null);
    if (token) {
      if (to.name === LOGIN_NAME) {
        next({ path: defaultRoutePath });
      } else {
        const hasRoute = router.hasRoute(to.name!);
        if (userStore.menus.length === 0) {
          // 从后台获取菜单
          const [err] = await _to(userStore.loginNext());
          if (err) {
            // userStore.resetToken();
            return next({ name: LOGIN_NAME });
          }
          if (!hasRoute) {
            // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
            next({ ...to, replace: true });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    } else {
       // not login
       if (whiteNameList.some((n) => n === to.name)) {
        // 在免登录名单，直接进入
        next();
      } else {
        next({ name: LOGIN_NAME, query: { redirect: to.fullPath }, replace: true });
      }
    }
  })
}

export default router
