import { login } from '@/api/login/login'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import storage from '@/plugins/utils/storage'
import { defineStore } from 'pinia'
import { getInfo, permmenu } from '@/api/account'

export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    token: '',
    name: 'amdin',
    avatar: '',
    perms: [],
    menus: [
      {
        createdAt: '2020-08-28 10:09:26',
        updatedAt: '2023-10-12 18:37:13',
        id: 1,
        parentId: null,
        name: '系统',
        router: '/sys',
        perms: null,
        type: 0,
        icon: 'icon-shezhi',
        orderNum: 255,
        viewPath: null,
        keepalive: false,
        isShow: true,
        isExt: false,
        openMode: 1
      },
      {
        createdAt: '2023-11-17 11:25:22',
        updatedAt: '2023-11-17 11:29:16',
        id: 381,
        parentId: null,
        name: '应急预案',
        router: '/emergency',
        perms: null,
        type: 0,
        icon: 'yuanhuan-guanbi',
        orderNum: 18,
        viewPath: null,
        keepalive: true,
        isShow: true,
        isExt: false,
        openMode: 1
      }
    ],
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
        const { data } = await login(params)
        this.setToken(data.token)
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
