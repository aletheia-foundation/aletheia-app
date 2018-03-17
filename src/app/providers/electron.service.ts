import { Injectable } from '@angular/core'

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer} from 'electron'
import {dialog} from 'electron'
import * as childProcess from 'child_process'

export class MockElectronService {
  public dialog = {
    showOpenDialog: () => {}
  }
  isElectron() {
    return true
  }
}

@Injectable()
export class ElectronService {
  public ipcRenderer: typeof ipcRenderer
  public dialog: typeof dialog
  public childProcess: typeof childProcess

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer
      this.childProcess = window.require('child_process')
      this.dialog = window.require('electron').remote.dialog
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type
  }

}
