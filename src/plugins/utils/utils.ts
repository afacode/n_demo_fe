import storage from './storage';
import { ElMessage } from 'element-plus';
import ClipboardJS from 'clipboard';
import en from 'element-plus/dist/locale/en.mjs';
import zh from 'element-plus/dist/locale/zh-cn.mjs';

// 是否是函数
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function' && val !== null && val !== undefined;
}

// 是否是对象
export function isObject(val: unknown): val is object {
  return typeof val === 'object' && val !== null && val !== undefined;
}

// 是否是字符串
export function isString(val: unknown): val is string {
  return typeof val === 'string' && val !== null && val !== undefined;
}

// 是否是数字
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && val !== null && val !== undefined;
}

// 是否是日期对象
export function isDate(val: unknown): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]';
}
export const isClient = window;
export const userAgent = isClient ? navigator.userAgent : null;
export const isFirefox = (): boolean => (userAgent ? /firefox/i.test(userAgent) : false);
export const isSafari = (): boolean => (userAgent ? /Safari/.test(userAgent) && !/Chrome/.test(userAgent) : false);

// 获取当前环境语言
export function getLanguage(): string {
  const language = (navigator.language || 'zh').toLocaleLowerCase(); // 这是获取浏览器的语言
  return (storage.getStorage('language', 'zh') || language.split('-')[0] || 'zh') as string;
}

// 设置element 语言
export function setElementLanguage() {
  const language: string = getLanguage();
  return language === 'zh' ? zh : en;
}

/**
 * 设置全局语言
 * @param language 语言类型
 */

export function setGlobalLanguage(language: string) {
  storage.setStorage({ key: 'language', data: language });
  window.location.reload();
}

/**
 * 防抖
 * @param {Function} fn 回调
 * @param {Number} delay 间隔时间
 * @returns
 */

export function debounce<T extends Function>(fn: T, delay: number) {
  if (!isFunction(fn)) throw `传入不是一个函数，请检查代码`;
  let timer: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...rest: any) {
    if (timer) {
      timer && clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...rest);
      timer && clearTimeout(timer);
      timer = null;
    }, delay);
  };
}

/**
 * 节流
 * @param {Function} fn 回调
 * @param {Number} delay 间隔时间
 * @returns
 */
export function throttle<T extends Function>(fn: T, delay: number) {
  if (!isFunction(fn)) throw new Error(`传入不是一个函数，请检查代码`);
  let timer: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...rest: any) {
    if (timer) return;
    timer = setTimeout(() => {
      fn(...rest);
      timer && clearTimeout(timer);
      timer = null;
    }, delay);
  };
}

// 删除返回
export function formatPageIndex(length: number, pageIndex: number): number {
  if (length <= 1 && pageIndex > 1) {
    pageIndex -= 1;
    return Math.max(pageIndex, 1);
  }
  return pageIndex;
}

/**
 * 复制文案
 * 使用例子，click不能添加.stop
 */
export function clipboardText() {
  let clipboard: ClipboardJS | null = null;
  const dom = document.getElementById('clipboardTarget');
  if (dom) {
    if (!clipboard) {
      clipboard = new ClipboardJS(dom);
    }
    clipboard.on('success', e => {
      e.clearSelection();
      clipboard?.destroy();
      ElMessage.success('复制成功');
    });
    clipboard.on('error', e => {
      e.clearSelection();
      clipboard?.destroy();
      ElMessage.success('复制失败');
    });
  }
}
/**
 * 转义标识符
 * @param {String} str value
 */
export function uniUnCode(str: string) {
  if (!str) return '';
  return str.replace(/[%=&#?](?:(25|3D|26|23|3F))?/g, function (a) {
    return (
      {
        '%': '%25',
        '=': '%3D',
        '&': '%26',
        '#': '%23',
        '?': '%3F',
      }[a] || ''
    );
  });
}

/**
 *  将str中的转义字符还原成html字符
 * @param {String} str value
 */
export function uniCode(str: string) {
  if (!str) return '';
  return str.replace(/%((25|3D|26|23|3F))/g, function (m) {
    return (
      {
        '%25': '%',
        '%3D': '=',
        '%26': '&',
        '%23': '#',
        '%3F': '?',
      }[m] || ''
    );
  });
}

/**
 * 新开窗口
 * @param path route path
 */
export const openNewWindow = (path: string) => {
  const a = document.createElement('a');
  a.href = window.location.origin + '/#' + path;
  a.setAttribute('target', '_blank');
  a.style.display = 'none';
  document.body.appendChild(a);
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent('click', true, true);
  a.dispatchEvent(clickEvent);
  setTimeout(() => {
    document.body.removeChild(a);
  });
};
