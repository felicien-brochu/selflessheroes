const path = require('path')
const packageJson = require('../../package.json')
const publishRelease = require('publish-release')

publishRelease({
  token: process.env.GH_TOKEN,
  owner: 'felicien-brochu',
  repo: 'selflessheroes',
  tag: `v${packageJson.version}`,
  reuseRelease: true,
  reuseDraftOnly: true,
  skipAssetsCheck: false,
  skipDuplicatedAssets: false,
  skipIfPublished: true,
  editRelease: false,
  deleteEmptyTag: false,
  assets: [path.resolve('./leveleditor-dist/sh-leveleditor.zip')]
}, (err, release) => {
  console.log("Release", release)
  if (err) {
    console.log("Error:\n", err)
  }
})