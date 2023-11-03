import { ServerConfig, ServerQueryConfig, NoTokenUrl, LanguageName } from './types';

export const AXIOS_CONFIG: ServerConfig = {
  baseURL: '/',
  // 请求头信息
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  // 设置超时时间
  timeout: 1000 * 60 * 3,
  // 携带凭证
  withCredentials: false,
  // 返回数据类型
  responseType: 'json',
};

// token 白名单
export const NO_TOKEN_URL: NoTokenUrl = ['/api/pc/common/users/login'];

//  初始化
export const QUERY_CONFIG: ServerQueryConfig = {
  url: '', // 请求地址
  data: {}, // 请求参数
  headers: {}, // 请求头
  target: '', // loading.target
  loadText: '数据加载中...',
  showLoad: false, // loading
  errToast: true, // errMessage
  isCancel: true, // 是否取消相同接口，上次还在pending中的接口
  bgColor: 'rgba(0,0,0,0.2)',
};

export const LANGUAGE_NAME: LanguageName = {
  zh: 'zh-CN',
  en: 'en-US',
};
