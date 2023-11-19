import { login } from '@/api/login/index'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import storage from '@/plugins/utils/storage'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router';
import { getInfo, permmenu } from '@/api/account'
import { generatorDynamicRouter } from '@/router/addRoutes'

interface UserState {
  token: string;
  name: string;
  avatar: string;
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[];
  menus: RouteRecordRaw[];
  userInfo: Partial<API.AdminUserInfo>;
}

export const useUserStore = defineStore({
  id: 'user',

  state: (): UserState => ({
    token: storage.getStorage(ACCESS_TOKEN_KEY, null),
    name: 'amdin',
    avatar: '',
    perms: [],
    menus: [],
    userInfo: {}
  }),

  getters: {
    getToken(): string {
      return this.token
    },
    getAvatar(): string {
      return this.avatar
    },
    getName(): string {
      return this.name
    },
    getPerms(): string[] {
      return this.perms
    }
  },

  actions: {
    /** 登录成功保存token */
    setToken(token: string) {
      this.token = token ?? ''
      // const ex = 7 * 24 * 60 * 60 * 1000;
      storage.setStorage({
        key: ACCESS_TOKEN_KEY,
        data: this.token
      })
    },
    async login(params: LoginParams) {
      try {
        const { token } = await login(params)
        console.log(token,'==========')
        this.setToken(token)
        return this.loginNext()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    //  登录成功之后, 获取用户信息以及生成权限路由
    async loginNext() {
      try {
        const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()])
        this.perms = perms
        this.name = userInfo.name
        this.avatar = userInfo.headImg
        this.userInfo = userInfo

        // 生成路由...
        const generatorResult = await generatorDynamicRouter(menus);
        this.menus = generatorResult.menus.filter((item) => !item.meta?.hideInMenu);
        console.log(this.menus, '===')
        return { menus, perms, userInfo }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})

type LoginParams = {
  captchaId: string
  password: string
  username: string
  verifyCode: string
}
