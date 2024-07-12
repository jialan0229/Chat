const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  callWindow: (options) => ipcRenderer.send('call-window', options),
  notificationText: (options) => ipcRenderer.send('notification-text', options),
  // 双向通信
  readFile: () => ipcRenderer.invoke('file-read'),
})