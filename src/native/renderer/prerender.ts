import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('apiKey', {
  doThing: () => ipcRenderer.send('do-a-thing'),
  myPromises: [Promise.resolve(), Promise.reject(new Error('whoops'))],
  data: {
    platform: process.platform
  }
})

// Renderer 使用
// window.apiKey.doThing()