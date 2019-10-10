const builder = require('electron-builder')

process.env.ELECTRON_BUILDER_CACHE = './.cache/electron-builder/'

const config = {
  appId: "fr.felicienbrochu.selflessheroes",
  productName: "Selfless Heroes",
  copyright: "Copyright © 2019 Félicien Brochu",
  directories: {
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
    "dist/workers/**/*",
  ],
  compression: "normal",
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true
  },
  win: {
    target: ["portable", "nsis"],
  },
  mac: {
    target: ["dmg"],
    category: "public.app-category.puzzle-games",
  },
  linux: {
    target: ["deb"],
    category: "Game",
    icon: "android-icon-512x512.png",
    packageCategory: "games",
  }
}

builder
  .build({
    config: config,
  })
  .then(message => {
    console.log(message)
  })
  .catch(exception => {
    console.error(exception)
  })