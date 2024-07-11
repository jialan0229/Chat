const { app, BrowserWindow, ipcMain  } = require('electron')
const { resolve } = require('path')

// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Chat',
    autoHideMenuBar: true, // 调式栏
    icon: resolve(__dirname, '../public/logo.png'),
    webPreferences: {
      /* // 书写渲染进程中的配置
      nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: true, // 隔离JavaScript环境和渲染进程
      enableRemoteModule: true, // remote模块允许渲染进程（即网页）直接调用主进程的 Node.js 代码 */
      preload: resolve(__dirname, './preload.js')
    },
  })

  // development模式
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 开启调试台
    win.webContents.openDevTools()
  } else {
    win.loadFile(resolve(__dirname, '../dist/index.html'))
  }
}

const handleCallWindow = (event, options) => {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    title: options.title,
    autoHideMenuBar: true, // 调式栏
    icon: resolve(__dirname, '../public/logo.png'),
    webPreferences: {
      preload: resolve(__dirname, './preload.js')
    },
  })

  // development模式
  if (process.env.VITE_DEV_SERVER_URL) {
    if(options.type === 1) {
      win.loadURL(`${process.env.VITE_DEV_SERVER_URL}call/audio-call`)
    }else {
      win.loadURL(`${process.env.VITE_DEV_SERVER_URL}call/video-call`)
    }
  } else {
    win.loadFile(resolve(__dirname, '../dist/index.html'))
  }
}

const readFile = () => {
  // 读取文件操作
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
  // 单向通信
  ipcMain.on('call-window', handleCallWindow)
  // 双向通信
  ipcMain.handle('file-read', readFile)

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


