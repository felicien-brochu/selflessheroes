'use strict'

// Quit after any uncaught exception
process.on("uncaughtException", err => {
  console.log("Uncaught exception:\n", err)
  console.log("Exiting app...")
  process.exit(1)
})
process.on('unhandledRejection', err => {
  console.log("Unhandled rejection:\n", err)
  console.log("Exiting app...")
  process.exit(1)
})

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

const isDev = process.argv.includes("--dev")
const isLive = process.argv.includes("--live")

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
    fullscreen: !isDev,
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
  if (isLive) {
    indexPath = url.format({
      protocol: 'http:',
      pathname: "localhost:3000",
      slashes: true
    })
  }

  // If the root page fails to load, exit app
  mainWindow.webContents.once('did-fail-load', (event, errCode, errDesc) => {
    console.log("did-fail-load: ", indexPath, errCode, errDesc)
    process.exit(1)
  })

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show()

    if (openFile) {
      loadCareerFromFile(openFile)
      openFile = null
    }

    // Open the DevTools automatically if developing
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.loadURL(indexPath)
  mainWindow.removeMenu()


  ipcMain.on('uncaught-error', (event, error) => console.log("Renderer error: ", error))

  ipcMain.on('open-link', (event, url) => {
    console.log("Open URL:", url)
    openLink(url)
  })

  ipcMain.on('request-fullscreen', () => mainWindow.setFullScreen(true))
  ipcMain.on('exit-fullscreen', () => {
    mainWindow.setFullScreen(false)
    mainWindow.maximize()
  })
  ipcMain.on('is-fullscreen-enabled', (event) => event.returnValue = mainWindow.isFullScreen())

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
  let noOptionArgs = argv.filter(arg => !arg.startsWith('-') && !arg.match(/^.*electron(\.exe|\.js)?$/))
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