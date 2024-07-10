// src-electron/main.js
const { app, BrowserWindow } = require('electron')
const { join } = require('path')

// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Chat',
    icon: join(__dirname, '../public/vite.svg'),
    webPreferences: {
      // 书写渲染进程中的配置
      nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: false, // 可以使用require方法
      enableRemoteModule: true, // 可以使用remote方法
    },
  })
  
  // development模式
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 开启调试台
    // win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


