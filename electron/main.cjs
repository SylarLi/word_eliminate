const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const win = new BrowserWindow({
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.setMenu(null)
  win.maximize()

  // 在开发环境中加载Vite开发服务器
  const isDev = process.argv.includes('--dev');
  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    // 在生产环境中加载打包后的文件
    const indexPath = path.join(__dirname, '../dist/index.html')
    if (fs.existsSync(indexPath)) {
      win.loadFile(indexPath).catch(err => {
        console.error('加载文件失败:', err)
        win.loadURL('data:text/html,<h1>文件加载失败，请重新安装应用</h1>')
      })
    } else {
      win.loadURL('data:text/html,<h1>未找到应用文件，请重新安装</h1>')
    }
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})