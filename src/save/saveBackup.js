const fs = require('fs')
const path = require('path')
const {
  ipcMain
} = require('electron')


const REV_FILE = "rev.txt"

function getCareerFileName(index) {
  index = index.toString()
  while (index.length < 3) {
    index = '0' + index
  }
  return `${index}.shsv`
}

module.exports = function(savePath) {
  return {
    savePath,
    savedRev: -1,
    currentRev: -1,
    savedCareers: [],
    careers: [],

    get revFile() {
      return path.resolve(this.savePath, REV_FILE)
    },

    init() {
      this.prepareSaveDir()
      this.load()

      this.connectIpc()
    },

    connectIpc() {
      ipcMain.on('load-careers-sync', (event) => {
        event.returnValue = {
          rev: this.savedRev,
          careers: this.savedCareers
        }
      })

      ipcMain.on('commit-careers', (event, careers, rev) => {
        this.commit(careers, rev, () => {
          try {
            event.reply('commit-careers-success', this.currentRev)
          } catch (e) {}
        })
      })

      ipcMain.on('save-careers', (event) => {
        this.save(() => {
          try {
            event.reply('save-careers-success', this.currentRev)
          } catch (e) {}
        })
      })

      ipcMain.on('commit-and-save-careers', (event, careers, rev) => {
        this.commit(careers, rev, () => {
          this.save(() => {
            try {
              event.reply('commit-and-save-careers-success', this.currentRev)
            } catch (e) {}
          })
        })
      })
    },

    prepareSaveDir() {
      if (!fs.existsSync(this.savePath)) {
        console.log("no save directory found at ", this.savePath)
        console.log("create save directory...")
        fs.mkdirSync(this.savePath)
        console.log("save directory created")
      }
    },

    getSavedRevId() {
      try {
        this.savedRev = parseInt(fs.readFileSync(this.revFile))
      } catch (err) {
        console.log(`no ${REV_FILE} available!`)
      }
    },

    saveRevId() {
      fs.writeFileSync(this.revFile, this.currentRev)
      this.savedRev = this.currentRev
    },

    load() {
      this.getSavedRevId()

      if (this.savedRev >= 0) {
        let saveFiles = fs.readdirSync(this.savePath).filter(file => file.match(/^[0-9]{3}\.shsv$/))
        saveFiles.sort()

        saveFiles.forEach((saveFile, i) => {
          this.savedCareers[i] = fs.readFileSync(path.resolve(this.savePath, saveFile), 'utf8')
        })
        this.careers = this.savedCareers.slice()
        this.currentRev = this.savedRev
      }
    },

    commit(careers, rev, callback) {
      this.careers = careers
      this.currentRev = rev

      if (typeof callback === 'function') {
        callback()
      }
    },

    async save(callback) {
      if (this.currentRev >= 0) {
        let careersToSave = this.careers

        await this.createBackupFiles()
        await this.writeFiles(careersToSave)

        this.saveRevId()
        this.savedCareers = careersToSave
        // console.log("Save success rev%d", this.savedRev)
      }

      if (typeof callback === 'function') {
        callback()
      }
    },

    async createBackupFiles() {
      let oldBackupFiles = fs.readdirSync(this.savePath).filter(file => file.match(/^[0-9]{3}\.shsv\.backup$/))
      let unlinkPromises = oldBackupFiles.map(file => fs.promises.unlink(path.resolve(this.savePath, file)))

      await Promise.all(unlinkPromises)

      let savedFiles = fs.readdirSync(this.savePath).filter(file => file.match(/^[0-9]{3}\.shsv$/))
      let renamePromises = savedFiles.map(file => {
        let oldName = path.resolve(this.savePath, file)
        let newName = oldName + ".backup"
        // console.log(`rename ${oldName} => ${newName}`)
        return fs.promises.rename(oldName, newName)
      })

      await Promise.all(renamePromises)
    },

    async writeFiles(careersToSave) {
      let writePromises = []
      careersToSave.forEach((career, i) => {
        let file = path.resolve(this.savePath, getCareerFileName(i))
        writePromises.push(fs.promises.writeFile(file, career))
      })
      await Promise.all(writePromises)
    }
  }
}