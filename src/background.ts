// main process
import { app, BrowserWindow } from 'electron'

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 渲染进程可使用node api
      contextIsolation: false, // 关闭渲染进程的沙箱
      webSecurity: false // 关闭跨域检测
    }
  })

  // 加载 Vue 应用的 index.html 文件
  if (process.argv[2]) {
    // 打开开发者工具
    win.webContents.openDevTools()
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
}
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
