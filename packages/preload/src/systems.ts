import {exposeInMainWorld} from './exposeInMainWorld';
import {ipcRenderer} from 'electron';

function exit() {
  ipcRenderer.send('system', {event: 'exit'});
}

function minimize() {
  ipcRenderer.send('system', {event: 'minimize'});
}

function maximize() {
  ipcRenderer.send('system', {event: 'maximize'});
}

function saveFile(data: ArrayBuffer | string, name: string) {
  ipcRenderer.send('system', {event: 'saveFile', data, name});
}

function selectFolder(defaultPath?:string):string|undefined {
  return ipcRenderer.sendSync('system', {event: 'selectFolder', defaultPath});
}

function loadSystemConfig():SystemConfig {
  return ipcRenderer.sendSync('system', {event: 'loadSystemConfig'});
}

function saveSystemConfig(data:SystemConfig): boolean {
  return ipcRenderer.sendSync('system', {event: 'saveSystemConfig', data});
}

function loadAppConfig():AppConfig {
  return ipcRenderer.sendSync('system', {event: 'loadAppConfig'});
}

function saveAppConfig(data:AppConfig) {
  ipcRenderer.send('system', {event: 'saveAppConfig', data});
}

function shouldUseDarkColors():boolean {
  return ipcRenderer.sendSync('system', {event: 'shouldUseDarkColors'});
}

// Export for types in contracts.d.ts
export const systems = {
  versions: process.versions,
  exit,
  minimize,
  maximize,
  saveFile,
  selectFolder,
  loadSystemConfig,
  saveSystemConfig,
  loadAppConfig,
  saveAppConfig,
  shouldUseDarkColors,
} as const;

exposeInMainWorld('systems', systems);
