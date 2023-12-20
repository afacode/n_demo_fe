import { BrowserWindow } from 'electron';

// https://www.electronjs.org/zh/docs/latest/api/browser-window

export const createWindow = async(options: any, routerPath?: string) => {
    options.webPreferences = {
        nodeIntegration: true, // 渲染进程可使用node api
        contextIsolation: false, // 关闭渲染进程的沙箱
        webSecurity: false, // 关闭跨域检测
    }
    const win = new BrowserWindow(options)

    // 加载 Vue 应用的 index.html 文件
routerPath = routerPath ? '/' +routerPath : '';
  if (process.argv[2]) {
    // 打开开发者工具
    win.webContents.openDevTools()
    win.loadURL(process.argv[2] + routerPath)
  } else {
    win.loadFile('index.html')
  }

    return win;
}
