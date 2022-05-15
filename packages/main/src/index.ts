import {app, BrowserWindow, dialog, globalShortcut, ipcMain, nativeTheme, clipboard, nativeImage, screen} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {createToolsWindow} from '/@/toolsWindow';
import {writeFileSync, readFileSync, existsSync, readdirSync} from 'fs';
import {moveSync, ensureDirSync} from 'fs-extra';
import * as path from 'path';
import robot from 'robotjs';

const lightTheme = {
  backgroundColor: '#ffffff',
  titleBarOverlay: {
    color: '#ff0000',
    symbolColor: '#333333',
  },
};

const darkTheme = {
  backgroundColor: '#000000',
  titleBarOverlay: {
    color: '#00ff00',
    symbolColor: '#aaaaaa',
  },
};

const userDataPath = app.getPath('userData');
const systemConfigPath = path.join(userDataPath, 'system.json');
let systemConfig:SystemConfig;
if(!existsSync(systemConfigPath)) {
  systemConfig = {appDir: path.join(userDataPath, 'app')};
  ensureDirSync(userDataPath);
  writeFileSync(systemConfigPath, JSON.stringify(systemConfig), {encoding: 'utf-8'});
} else {
  systemConfig = JSON.parse(readFileSync(systemConfigPath, {encoding: 'utf-8'}));
}
ensureDirSync(systemConfig.appDir);

const DEFAULT_APP_CONFIG:AppConfig = {
  articleDir: 'articles',
  language: 'en',
  darkMode: 'system',
};

function getAppDir():string {
  return systemConfig.appDir;
}

function getAppConfigPath():string {
  return path.join(getAppDir(), 'config.json');
}

function readAppConfig():AppConfig {
  const appConfigPath = getAppConfigPath();
  return existsSync(appConfigPath) ? {...DEFAULT_APP_CONFIG, ...JSON.parse(readFileSync(appConfigPath, {encoding: 'utf-8'}))} : {...DEFAULT_APP_CONFIG};
}

function saveAppConfig(data:AppConfig) {
  const appDir = getAppDir();
  ensureDirSync(appDir);
  const appConfigPath = getAppConfigPath();
  writeFileSync(appConfigPath, JSON.stringify(data), {encoding: 'utf-8'});
  if(data.darkMode !== nativeTheme.themeSource) {
    // darkMode is changed
    nativeTheme.themeSource = data.darkMode;
    syncNativeTheme();
  }
}

function syncNativeTheme() {
  const colors = nativeTheme.shouldUseDarkColors ? darkTheme : lightTheme;
  BrowserWindow.getAllWindows().forEach(w => {
    if(w.getTitle() !== 'Tools') {
      w.setBackgroundColor(colors.backgroundColor);
    }
  });
}

nativeTheme.themeSource = readAppConfig().darkMode;
syncNativeTheme();


function transferAppDir(oldDir:string, newDir:string): boolean {
  try {
    if(!existsSync(newDir)) {
      ensureDirSync(newDir);
    } else {
      // check exists
      for(const f of readdirSync(oldDir)) {
        const newFile = path.join(newDir, f);
        if(existsSync(newFile)) {
          return false;
        }
      }
    }
    for(const f of readdirSync(oldDir)) {
      moveSync(path.join(oldDir, f), path.join(newDir, f));
    }
    return true;
  } catch(e) {
    console.error('Failed to transfer app dir:', e);
    return false;
  }
}

// app.disableHardwareAcceleration();

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
        window.restore();
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
    return;
  }
  if(msg.event === 'selectFolder') {
    const defaultPath:string|undefined = msg.defaultPath;
    const selected = dialog.showOpenDialogSync({properties: ['openDirectory', 'createDirectory'], defaultPath});
    event.returnValue = selected && selected.length > 0 ? selected[0] : null;
    return;
  }
  if(msg.event === 'loadSystemConfig') {
    systemConfig = JSON.parse(readFileSync(systemConfigPath, {encoding: 'utf-8'}));
    event.returnValue = systemConfig;
    return;
  }
  if(msg.event === 'saveSystemConfig') {
    const data:SystemConfig = msg.data;
    data.appDir = path.normalize(data.appDir);
    const oldAppDir = getAppDir();
    if(path.normalize(oldAppDir) !== data.appDir) {
      // appDir changed
      if(!transferAppDir(oldAppDir, data.appDir)) {
        event.returnValue = false;
        return;
      }
    }
    writeFileSync(systemConfigPath, JSON.stringify(data), {encoding: 'utf-8'});
    systemConfig = data;
    event.returnValue = true;
    return;
  }
  if(msg.event === 'shouldUseDarkColors') {
    event.returnValue = nativeTheme.shouldUseDarkColors;
    return;
  }
  if(msg.event === 'loadAppConfig') {
    event.returnValue = readAppConfig();
    return;
  }
  if(msg.event === 'saveAppConfig') {
    const data:AppConfig = msg.data;
    saveAppConfig(data);
    return;
  }
  if(msg.event === 'openToolsWindow') {
    createToolsWindow();
    return;
  }
  if(msg.event === 'isMaximized') {
    event.returnValue = BrowserWindow.getFocusedWindow()?.isMaximized() ?? false;
  }
});

ipcMain.on('tools', function(event, msg) {
  if(msg.event === 'exitToolsWindow') {
    BrowserWindow.getAllWindows().find(w => w.title === 'Tools')?.close();
    // globalShortcut.unregister('Escape');
    globalShortcut.unregister('Alt+CommandOrControl+A');
    globalShortcut.unregister('PrintScreen');
    return;
  }
  if(msg.event === 'captureScreen') {
    const bitmap = msg.data ? robot.screen.capture(msg.data.x, msg.data.y, msg.data.width, msg.data.height) : robot.screen.capture(0, 0, screen.getPrimaryDisplay().workAreaSize.width, screen.getPrimaryDisplay().workAreaSize.height);
    const image = nativeImage.createFromBuffer(Buffer.from(bitmap.image), {width: bitmap.width, height: bitmap.height});
    clipboard.writeImage(image);
    event.returnValue = true;
    return;
  }
});
