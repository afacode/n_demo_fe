import axios from 'axios';
import { ElLoading, ElMessage,ElMessageBox } from 'element-plus';
import { getLanguage } from '@/plugins/utils/utils';
import storage from '../utils/storage';
import { AXIOS_CONFIG, NO_TOKEN_URL, QUERY_CONFIG, LANGUAGE_NAME } from './config';
import * as types from './types.d';
import type { Action } from 'element-plus'

const lang: string = getLanguage();

/**
 * 初始化
 */
let isRedirect = true; // 判断401
const server: types.ServerInstance = axios.create(AXIOS_CONFIG);
const CancelToken = axios.CancelToken;

/**
 * 添加请求拦截器
 */
server.interceptors.request.use(
  (config: types.AxiosRequestConfig) => setConfig(config),
  (error: types.ServerErrorConfig) => rejectData(error)
);

/**
 * 返回状态判断(添加响应拦截器)
 */
server.interceptors.response.use(
  (res: types.AxiosResponse) => {
    // blob返回报文不报错，直接下载
    // if ((res.data.code === '200' && res.data.successful) || (res.status === 200 && res.config.responseType === 'blob')) {
    //   isRedirect = true;
    //   if (res.config && res.config.url && server[res.config.url]) {
    //     server[res.config.url].loading && server[res.config.url].loading.close();
    //     server[res.config.url] = null;
    //   }

    //   return res.data;
    // }
    if (res.data.code == '200') {
      return res.data.data;
    }

    return rejectData(res);
  },
  (error: types.ServerErrorConfig) => rejectData(error)
);

/**
 * 设置请求的配置
 * @param {Object} config 配置参数
 */
function setConfig(config: types.ServerRequestConfig) {
  if (!config.headers) config.headers = {};
  // 设置token
  if (config && config.url && NO_TOKEN_URL.indexOf(config.url) === -1) {
    config.headers['authorization'] = storage.getStorage('token');
  }

  // 设置语言
  config.headers['Accept-Language'] = LANGUAGE_NAME[lang as keyof typeof LANGUAGE_NAME];

  // 设置取消接口回调
  if (config.url && server[config.url].isCancel) {
    config.cancelToken = new CancelToken(function cancel(cb) {
      config.url && (server[config.url].cancel = cb);
    });
  }

  return config;
}

/**
 * 错误返回
 * @param {Object} err
 */

function rejectData(err: types.ServerErrorConfig): Promise<types.AxiosError> {
  // 自动取消
  if (err && err.code === 'ERR_CANCELED' && err.name === 'CanceledError' && err.config && err.config.url) {
    server[err.config.url] && (server[err.config.url] = null); // 重置
    return Promise.reject({
      code: '200',
      data: null,
      message: err.message,
    });
  }

  // 清楚loading
  if (err.config && err.config.url && server[err.config.url] && server[err.config.url].loading) {
    server[err.config.url].loading.close();
  }

  // 登录失效
  if (err.data && ['401', 401].indexOf(err.data.code) !== -1) {
    isRedirect = false;
    ElMessageBox.alert('This is a message', 'Title', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        callback: (action: Action) => {
          ElMessage({
            type: 'info',
            message: `action: ${action}`,
          })
        },
      })
    // ElMessageBox({
    //   title: err.message || err.data.message || 'Login failed, please log in again!',
    //   isCloneIcon: false,
    //   isCloseByEnter: true,
    // }).then(() => {
    //   storage.deleteStorage('token', StorageName.localStorage, () => {
    //     const { origin, hash, pathname } = window.location;
    //     window.location.replace(`${origin}${pathname}#/login/index?redirect_hash=${hash.substring(1)}&t=${new Date().getTime()}`);
    //   });
    // });
    // token失效在此操作
    return Promise.reject(instanceError(err));
  }

  // 请求超时
  if (err.data && ['timeout', 'Network Error'].indexOf(err.data.message) !== -1) {
    ElMessage.error('Network request timed out, please try again later!');
  }

  if (err.message && err.message.includes('code 404')) {
    ElMessage.error('Network request does not exist, please contact system administrator!');
  }

  return Promise.reject(instanceError(err));
}

/**
 * 接口返回报错
 * @param {String} error 报错
 * @param {Object} err 参数
 */
function instanceError(err: types.ServerErrorConfig): types.ErrorMessage {
  err['data'] = err?.data || { message: '', code: '', successful: false };
  const { message, code, successful } = err.data;
  const ERROR_PARAMS = {
    code,
    successful,
    url: err.config?.url || '',
    path: window.location.href,
    data: (err.config && server[err.config.url]?.data) || '',
    message: message || err?.message || err.data.message || 'The system is busy, please try again later!',
  };

  // 需要配置：提示报错
  if (err.config && err.config.url && server[err.config.url]?.errToast && isRedirect) {
    ElMessage.error(message || 'The system is busy, please try again later!');
  }

  // 重置
  err.config && err.config.url && (server[err.config.url] = null);
  return ERROR_PARAMS;
}

/**
 * 是不是函数
 * @param {Function} fn 函数
 */
function isFn(fn: () => void): boolean {
  return typeof fn === 'function' && fn !== null && fn !== undefined;
}

/**
 *  请求
 * @param {*} res 参数
 * @param {*} method 类型
 * @returns
 */
function request(res: types.ServerQueryConfig, method: types.Method): Promise<types.ServerData> {
  setInstanceConfig(res);

  return server({
    method,
    url: res.url,
    responseType: res.responseType || 'json',
    params: method.toLocaleUpperCase() !== 'POST' ? res.data || {} : {},
    data: method.toLocaleUpperCase() === 'POST' ? res.data || {} : {},
    headers: Object.assign({}, AXIOS_CONFIG.headers, res.headers),
    // 上传进度
    onUploadProgress(progressEvent: types.AxiosProgressEvent): void {
      res.upload && isFn(res.upload) && res.upload(progressEvent);
    },
    // 下载进度
    onDownloadProgress(progressEvent: types.AxiosProgressEvent) {
      res.download && isFn(res.download) && res.download(progressEvent);
    },
  });
}

// 设置配置文件
function setInstanceConfig(res: types.ServerQueryConfig): void {
  res = Object.assign(QUERY_CONFIG, res);

  if (server[res.url] && server[res.url].cancel) {
    server[res.url].cancel('Request cancellation');
    server[res.url] = null;
  }

  if (!server[res.url]) {
    server[res.url] = res;
  }

  // 是否打开loading
  if (res.showLoad) {
    server[res.url].loading = ElLoading.service({
      target: res.target,
      text: res.loadText,
      background: res.bgColor,
    });
  }
}

/**
 * post请求方法
 * @param {Object} res 参数
 */
export const Post = (res: types.ServerQueryConfig) => {
  return request(res, 'POST');
};

/**
 * get请求方法
 * @param {Object} res 参数
 */
export const Get = (res: types.ServerQueryConfig) => {
  return request(res, 'GET');
};

/**
 * Download 请求方法
 * @param data
 * @returns
 */
export const Download = (res: types.ServerQueryConfig) => {
  res.responseType = 'blob';
  res.headers = { 'Content-Type': 'application/json;charset=UTF-8' };
  return request(res, 'POST');
};
