import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { exec } from 'node:child_process';
import { AppConfig } from '../config/AppConfig.js';
import { PlaywrightHandlers } from './handlers/PlaywrightHandlers.js';
import { FingerprintPlaywrightHandlers } from './handlers/FingerprintPlaywrightHandlers.js';

// Create config instance
const appConfig = new AppConfig();

// Initialize Playwright handlers
let playwrightHandlers: PlaywrightHandlers;
let fingerprintPlaywrightHandlers: FingerprintPlaywrightHandlers;

// Add command line switches before the app is ready
app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ build-electron
// │ │ └── electron-main.js
// │ │
// │ ├─┬ renderer
// │ │ └── index.html
// │
process.env.APP_ROOT = path.join(dirname, '../..');

export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'build-electron/electron-main');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'build-electron/renderer');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: appConfig.window.width,
    height: appConfig.window.height,
    icon: path.join(process.env.VITE_PUBLIC || '', 'favicon.ico'),
    webPreferences: {
      preload: path.join(dirname, '../electron-preload/index.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // Disable sandbox for development
    }
  });

  // Test active push message to a Renderer-process.
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
  } else {
    const indexPath = path.join(RENDERER_DIST, 'index.html');
    console.log('Loading file:', indexPath);
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load file:', err);
    });
  }

  // Open DevTools if configured (environment-agnostic)
  if (appConfig.development.openDevTools) {
    win.webContents.openDevTools();
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ========== IPC Handlers for OS Integration ==========

// Handler to open URLs in an external browser (Chrome if available)
ipcMain.handle('open-external-url', async (event, url: string) => {
  try {
    console.log('Opening external URL:', url);

    // Windows: Try Chrome first, fallback to the default browser
    exec(`start chrome "${url}"`, error => {
      if (error) {
        console.log('Chrome not found, using default browser');
        shell.openExternal(url);
      }
    });

    return { success: true, message: 'URL opened successfully' };
  } catch (error) {
    console.error('Error opening external URL:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});

// Handler to get system information
ipcMain.handle('get-system-info', async () => {
  try {
    const systemInfo = {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      appVersion: app.getVersion(),
      appName: app.getName()
    };

    console.log('System info requested:', systemInfo);
    return { success: true, data: systemInfo };
  } catch (error) {
    console.error('Error getting system info:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});

// Handler to show native notification
ipcMain.handle('show-notification', async (event, title: string, body: string) => {
  try {
    const { Notification } = await import('electron');

    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body,
        icon: path.join(process.env.VITE_PUBLIC || '', 'favicon.ico')
      });

      notification.show();
      console.log('Notification shown:', { title, body });
      return { success: true, message: 'Notification shown' };
    } else {
      return { success: false, message: 'Notifications not supported' };
    }
  } catch (error) {
    console.error('Error showing notification:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});

// ========== Initialize Playwright Handlers ==========

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Initialize Playwright handlers
  playwrightHandlers = new PlaywrightHandlers();

  // Initialize Fingerprint Playwright handlers
  fingerprintPlaywrightHandlers = new FingerprintPlaywrightHandlers();

  createWindow();
});

// Quit when all windows are closed (Windows behavior)
app.on('window-all-closed', async () => {
  // Clean up Playwright sessions before quitting
  if (playwrightHandlers) {
    await playwrightHandlers.cleanup();
  }

  // Clean up Fingerprint Playwright sessions before quitting
  if (fingerprintPlaywrightHandlers) {
    await fingerprintPlaywrightHandlers.cleanup();
  }

  app.quit();
  win = null;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
