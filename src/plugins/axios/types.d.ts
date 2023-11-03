export type {
    Method,
    AxiosError,
    CancelToken,
    AxiosResponse,
    AxiosInstance,
    AxiosProgressEvent,
    AxiosRequestConfig,
    CreateAxiosDefaults,
    AxiosRequestHeaders,
    InternalAxiosRequestConfig,
  } from 'axios';
  
  export type ServerInstance = AxiosInstance;
  
  // axios 配置
  export interface ServerConfig extends CreateAxiosDefaults {
    baseURL: string;
    headers: object;
    timeout: number;
    responseType: 'json';
    withCredentials: boolean;
  }
  
  // 请求参数配置
  export interface ServerQueryConfig extends CreateAxiosDefaults {
    url: string;
    data?: unknown;
    target?: string;
    headers?: object;
    bgColor?: string;
    loadText?: string;
    isCancel?: boolean;
    showLoad?: boolean;
    errToast?: boolean;
    responseType?: string;
    upload?: (data?: T) => void | T;
    download?: (data?: T) => void | T;
  }
  
  // 白名单
  export type NoTokenUrl = Array<string>;
  
  // 配置config
  export interface ServerRequestConfig extends AxiosRequestConfig {
    url?: string;
    cancelToken?: CancelToken;
    headers?: AxiosRequestHeaders & {
      authorization: string;
      'Accept-Language': string;
    };
  }
  
  // 错误信息
  export interface ServerErrorConfig extends AxiosError {
    name?: string;
    code?: string;
    message?: string;
    config: InternalAxiosRequestConfig<D> & {
      url: string;
    };
    data: {
      code: string;
      message: string;
      successful: boolean;
    };
  }
  
  // 返回报错信息
  export type ErrorMessage = {
    code: string;
    url: string;
    path: string;
    message: string;
    errTime?: string;
    data: object | null;
    successful: boolean;
  };
  
  export type SuccessMessage = {
    code: string;
    data: T;
    successful: boolean;
  };
  
  // 成功/失败的返回
  export type ServerData = ErrorMessage & SuccessMessage & Blob;
  
  export type LanguageName = {
    zh: string;
    en: string;
  };
  