const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  callWindow: (options) => ipcRenderer.send('call-window', options),
  // 双向通信
  readFile: () => ipcRenderer.invoke('file-read')
})