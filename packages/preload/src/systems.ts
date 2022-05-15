import {exposeInMainWorld} from './exposeInMainWorld';
import {ipcRenderer} from 'electron';

ipcRenderer.on('system', (event, msg) => {
  msg.channel = 'system';
  window.postMessage(msg, '*', event.ports);
});

function exit() {
  ipcRenderer.send('system', {event: 'exit'});
}

function minimize() {
  ipcRenderer.send('system', {event: 'minimize'});
}

function maximize() {
  ipcRenderer.send('system', {event: 'maximize'});
}

function isMaximized():boolean {
  return ipcRenderer.sendSync('system', {event: 'isMaximized'});
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

function openToolsWindow() {
  ipcRenderer.send('system', {event: 'openToolsWindow'});
}

// Export for types in contracts.d.ts
export const systems = {
  versions: process.versions,
  exit,
  minimize,
  maximize,
  isMaximized,
  saveFile,
  selectFolder,
  loadSystemConfig,
  saveSystemConfig,
  loadAppConfig,
  saveAppConfig,
  shouldUseDarkColors,
  openToolsWindow,
} as const;

exposeInMainWorld('systems', systems);
