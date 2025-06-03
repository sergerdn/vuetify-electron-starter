import { app, BrowserWindow, shell } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Add command line switches before app is ready
app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ out
// │ │ └── main.js
// │ │
// │ ├─┬ renderer
// │ │ └── index.html
// │
process.env.APP_ROOT = path.join(dirname, '../..');

export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'out/main');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'out/renderer');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC || '', 'favicon.ico'),
    webPreferences: {
      preload: path.join(dirname, '../preload/index.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // Disable sandbox for development
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on('dom-ready', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Add error handling for loading
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  win.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else if (process.env.NODE_ENV === 'development') {
    // In development mode, try to connect to the Vite dev server
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(RENDERER_DIST, 'index.html');
    console.log('Loading file:', indexPath);
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load file:', err);
    });
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
