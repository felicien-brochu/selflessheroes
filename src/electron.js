'use strict'

// Import parts of electron to use
const {
  app,
  protocol,
  ipcMain,
  BrowserWindow
} = require('electron')
const openLink = require('open')
const path = require('path')
const url = require('url')
const fs = require('fs')

const isDev = false

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const gotTheLock = app.requestSingleInstanceLock()
let openFile = null

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv, workingDir) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()

      let fileToOpen = getFileToOpen(argv, workingDir)

      if (!openFile && fileToOpen) {
        if (!app.isReady()) {
          openFile = fileToOpen
        } else {
          loadCareerFromFile(fileToOpen)
        }
      }
    }
  })
}

function loadCareerFromFile(file) {
  let fileContent = fs.readFileSync(file, 'utf8')
  mainWindow.webContents.send('load-career-file', fileContent)
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
    },
  })

  // and load the index.html of the app.
  let indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '../dist/index.html'),
    slashes: true
  })

  mainWindow.loadURL(indexPath)
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show()

    if (openFile) {
      loadCareerFromFile(openFile)
      openFile = null
    }
  })
  mainWindow.removeMenu()
  mainWindow.setFullScreen(true)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    // mainWindow.maximize()
    ipcMain.on('open-link', (event, url) => {
      console.log("Open URL:", url)
      openLink(url)
    })


    // Open the DevTools automatically if developing
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

app.on('will-finish-launching', () => {
  app.on('open-file', (evt, path) => {
    evt.preventDefault()
    if (app.isReady()) {
      loadCareerFromFile(openFile)
    } else {
      openFile = path
    }
  })
})

function getFileToOpen(argv, workingDir) {
  let file = null
  let noOptionArgs = argv.filter(arg => !arg.startsWith('-'))
  if (noOptionArgs.length >= 2) {
    file = noOptionArgs[noOptionArgs.length - 1]
    file = path.resolve(workingDir, file)

    if (!fs.existsSync(file)) {
      file = null
    }
  }

  return file
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  let fileToOpen = getFileToOpen(process.argv, process.cwd())

  if (!openFile && fileToOpen) {
    openFile = fileToOpen
  }

  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})