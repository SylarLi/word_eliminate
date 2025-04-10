const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// 获取词库路径
const getWordLibraryPath = () => {
  return path.join(app.getPath('userData'), 'word_library.txt')
}

function createWindow() {
  const isDev = process.argv.includes('--dev');
  const win = new BrowserWindow({
    frame: true,
    webPreferences: {
      nodeIntegration: false, // Should be false when using contextBridge
      contextIsolation: true, // Should be true for security
      webSecurity: false,
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js') // Add this line
    }
  })
  if (!isDev) {
    win.setMenu(null)
  }
  win.maximize()

  // 检查词库文件是否存在，如果不存在则复制默认词库文件
  const libPath = getWordLibraryPath()
  if (!fs.existsSync(libPath)) {
    fs.copyFileSync(
      path.join(__dirname, '../dist/assets/words/word_library.txt'),
      libPath
    )
  }

  // 在开发环境中加载Vite开发服务器
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

// 在app.whenReady()之前添加
const { ipcMain } = require('electron')

ipcMain.handle('get-word-library', () => {
  return fs.readFileSync(getWordLibraryPath(), 'utf-8')
})

ipcMain.on('save-word-library', (_, content) => {
  fs.writeFileSync(getWordLibraryPath(), content)
})

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