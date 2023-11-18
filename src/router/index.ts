import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard/welcome',
    component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
    meta: {
      title: '首页',
    },
    children: [],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/login.vue'),
    meta: {
      title: '登录',
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => {
    return { left: 0, top: 0 };
  },
  // [
  //   {
  //     path: '/',
  //     name: 'home',
  //     component: HomeView
  //   },
    
  //   {
  //     path: '/about',
  //     name: 'about',
  //     // route level code-splitting
  //     // this generates a separate chunk (About.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import('@/views/AboutView.vue')
  //   }
  // ],
  // 默认位置
})

export default router
