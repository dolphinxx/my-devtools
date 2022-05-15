import {BrowserWindow, globalShortcut, screen} from 'electron';
import {join} from 'path';
import {URL} from 'url';

const title = 'Tools';

export async function createToolsWindow() {
  if(BrowserWindow.getAllWindows().find(_ => _.title === title)) {
    return;
  }
  BrowserWindow.getFocusedWindow()?.minimize();
  const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
  const browserWindow = new BrowserWindow({
    title,
    show: false, // Use 'ready-to-show' event to show window
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    movable: false,
    resizable: false,
    maximizable: false,
    fullscreenable: true,
    simpleFullscreen: true,
    // fullscreen: true,
    // kiosk: true,
    enableLargerThanScreen: true,
    width: workAreaSize.width,
    height: workAreaSize.height,
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    globalShortcut.register('Alt+CommandOrControl+A', () => {
      browserWindow.show();
      browserWindow.webContents.send('tools', {event: 'shortcut', data: 'Alt+CommandOrControl+A'});
    });
    globalShortcut.register('PrintScreen', () => {
      browserWindow.webContents.send('tools', {event: 'shortcut', data: 'PrintScreen'});
    });
    // globalShortcut.register('Escape', () => {
    //   browserWindow.webContents.send('tools', {event: 'shortcut', data: 'Escape'});
    // });
    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools({
        mode: 'undocked',
      });
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL_TOOLS !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL_TOOLS
    : new URL('../renderer/dist/tools.html', 'file://' + __dirname).toString();


  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}
