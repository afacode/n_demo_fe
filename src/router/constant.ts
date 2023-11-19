export const LOGIN_NAME = 'Login';

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

// 路由白名单
export const whiteNameList = [LOGIN_NAME, 'icons', 'error', 'error-404'] as const; // no redirect whitelist

export type WhiteNameList = typeof whiteNameList;

export type WhiteName = (typeof whiteNameList)[number];

export function useRouteFiles() {
  const files = import.meta.glob([
    '/src/views/*/*/**.vue', // 获取views目录里面的页面
    '/src/views/**/*.vue', // 获取views目录里面的页面
    // '!/src/views/*/*/*[Detail].vue', // 过滤掉 detail 页面
    '!/src/views/**/components/*.vue', // 过滤掉components 组件页面
  ]);
  // 转化下 {name: import => ()}
  let fileKey: Array<string> = [];
  const routeFiles = {}
  for (const key in files) {
    if (!/\/(login|components)\//.test(key)) {
      routeFiles[key] = files[key]
    }
  }
  return routeFiles
}