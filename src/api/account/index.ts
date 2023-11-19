import { Get, Post } from '@/plugins/axios/index'

export function getInfo() {
  return Get({
    url: 'account/info'
  })
}

export function permmenu() {
  return Get({
    url: 'account/permmenu'
  })
}
