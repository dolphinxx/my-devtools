import {app, ipcMain, BrowserWindow, dialog} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {writeFileSync} from 'fs';


/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));


/**
 * Install Vue.js or some other devtools in development mode only
 */
// if (import.meta.env.DEV) {
//   app.whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
//       loadExtensionOptions: {
//         allowFileAccess: true,
//       },
//     }))
//     .catch(e => console.error('Failed install extension:', e));
// }

// /**
//  * Check new app version in production mode only
//  */
// if (import.meta.env.PROD) {
//   app.whenReady()
//     .then(() => import('electron-updater'))
//     .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
//     .catch((e) => console.error('Failed check updates:', e));
// }

ipcMain.on('system', function(event, msg) {
  if(msg.event === 'exit') {
    app.quit();
    return;
  }
  if(msg.event === 'minimize') {
    BrowserWindow.getFocusedWindow()?.minimize();
    return;
  }
  if(msg.event === 'maximize') {
    const window = BrowserWindow.getFocusedWindow();
    if(window) {
      if(window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
    return;
  }
  if(msg.event === 'saveFile') {
    const data:ArrayBuffer|string = msg.data;
    dialog.showSaveDialog({defaultPath: msg.name}).then(_ => {
      if (_.canceled || !_.filePath) {
        return;
      }
      if (typeof data === 'string') {
        writeFileSync(_.filePath, data, {encoding: 'utf-8'});
      } else {
        writeFileSync(_.filePath, new Uint8Array(data), {encoding: 'binary'});
      }
    });
  }
});
