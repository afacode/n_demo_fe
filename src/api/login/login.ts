import { Get, Post } from '@/plugins/axios/index'
/**
 * @description 获取验证码
 */
export function getImageCaptcha(data?: API.CaptchaParams) {
  return Get({
    url: 'captcha/img',
    data
  })
}

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return Post({
    url: 'login',
    data
  })
}
