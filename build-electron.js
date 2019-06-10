const builder = require('electron-builder')
const Platform = builder.Platform
const Arch = builder.Arch

process.env.ELECTRON_BUILDER_CACHE = './.cache/electron-builder/'

var target = Platform.WINDOWS.createTarget('portable', Arch.x64)
var target = Platform.WINDOWS.createTarget('portable', Arch.ia32)
const targetArgs = {
  'win32': Platform.WINDOWS.createTarget('portable', Arch.ia32),
  'win64': Platform.WINDOWS.createTarget('portable', Arch.x64),
  'linux32': Platform.LINUX.createTarget(Arch.ia32),
  'linux64': Platform.LINUX.createTarget(Arch.x64),
  'macos': Platform.MAC.createTarget(),
  'default': Platform.WINDOWS.createTarget('portable', Arch.x64)
}

var targets = process.argv.filter(arg => !!targetArgs[arg]).map(arg => targetArgs[arg])
if (targets.length === 0) {
  targets.push(targetArgs.default)
}

const config = {
  appId: "fr.felicienbrochu.aiworld",
  productName: "AIWorld",
  copyright: "Copyright © 2019 Félicien Brochu",
  directories: {
    app: '.',
    output: 'electron-dist',
    buildResources: 'dist'
  },
  files: [
    "src/electron.js",
    "dist/index.html",
    "dist/app.js",
    "dist/vendors~app.js",
    "dist/phaser.js",
    "dist/vendors~app~phaser.js",
    "dist/app.css",
    "dist/assets/**/*",
    "dist/levels/**/*",
    "dist/workers/**/*",
  ],
  compression: "normal",
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true
  },
  win: {
    target: ['portable']
  },
  mac: {
    category: "public.app-category.puzzle-games",
    target: ["dmg"]
  },
  linux: {
    target: "AppImage",
    category: "Game"
  }
}

builder
  .build({
    targets: targets[0],
    config: config,
  })
  .then(message => {
    console.log(message)
  })
  .catch(exception => {
    console.error(exception)
  })