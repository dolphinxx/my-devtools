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

// Export for types in contracts.d.ts
export const systems = {
  versions: process.versions,
  exit,
  minimize,
  maximize,
  saveFile,
} as const;

exposeInMainWorld('systems', systems);
