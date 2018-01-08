import { Injectable } from '@angular/core'

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as electron from 'electron'
import * as childProcess from 'child_process'

@Injectable()
export class ElectronService {
  public ipcRenderer: typeof electron.ipcRenderer
  public childProcess: typeof childProcess
  public electron: typeof electron

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer
      this.electron = window.require('electron')
      this.childProcess = window.require('child_process')
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type
  }

}
