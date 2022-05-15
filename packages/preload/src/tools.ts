import {exposeInMainWorld} from './exposeInMainWorld';
import {ipcRenderer} from 'electron';

ipcRenderer.on('tools', (event, msg) => {
  msg.channel = 'tools';
  window.postMessage(msg, '*', event.ports);
});

function exitToolsWindow() {
  ipcRenderer.send('tools', {event: 'exitToolsWindow'});
}

function captureScreen(rect?:{x:number, y: number, width: number, height: number}):boolean {
  return ipcRenderer.sendSync('tools', {event: 'captureScreen', data: rect});
}

// Export for types in contracts.d.ts
export const tools = {
  exitToolsWindow,
  captureScreen,
} as const;

exposeInMainWorld('tools', tools);
