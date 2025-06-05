import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  }

  // You can expose other APIs you need here.
  // ...
});

// --------- Expose OS Integration APIs ---------
contextBridge.exposeInMainWorld('electronAPI', {
  // Open URL in an external browser (Chrome if available)
  openExternalUrl: (url: string) => ipcRenderer.invoke('open-external-url', url),

  // Get system information
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // Show native notification
  showNotification: (title: string, body: string) =>
    ipcRenderer.invoke('show-notification', title, body),

  // Check if running in Electron
  isElectron: true,

  // Get platform info
  platform: process.platform,

  // Playwright browser automation APIs
  launchBrowser: (browser: 'chrome' | 'firefox', url: string) =>
    ipcRenderer.invoke('launch-browser', browser, url),

  // Get available browsers
  getAvailableBrowsers: () => ipcRenderer.invoke('get-available-browsers'),

  // Close the browser process
  closeBrowser: (processId: number) => ipcRenderer.invoke('close-browser', processId),

  // Get active browser sessions
  getActiveSessions: () => ipcRenderer.invoke('get-active-sessions'),

  // Get session details
  getSessionDetails: (processId: number) => ipcRenderer.invoke('get-session-details', processId),

  // Fingerprint Playwright APIs
  // Set fingerprint service key
  fingerprintSetServiceKey: (key: string) => ipcRenderer.invoke('fingerprint-set-service-key', key),

  // Get current fingerprint service key
  fingerprintGetServiceKey: () => ipcRenderer.invoke('fingerprint-get-service-key'),

  // Fetch a new fingerprint
  fingerprintFetch: (tags?: string[]) => ipcRenderer.invoke('fingerprint-fetch', tags),

  // Launch browser with fingerprint (Chromium only)
  fingerprintLaunchBrowser: (url: string, fingerprint: string) =>
    ipcRenderer.invoke('fingerprint-launch-browser', url, fingerprint),

  // Close fingerprint browser
  fingerprintCloseBrowser: (processId: number) =>
    ipcRenderer.invoke('fingerprint-close-browser', processId),

  // Get active fingerprint sessions
  fingerprintGetActiveSessions: () => ipcRenderer.invoke('fingerprint-get-active-sessions'),

  // Check if fingerprint service is available (Windows only)
  fingerprintIsAvailable: () => ipcRenderer.invoke('fingerprint-is-available')
});

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(c => c === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(c => c === child)) {
      return parent.removeChild(child);
    }
  }
};

function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% {
    transform: perspective(100px) rotateX(180deg) rotateY(0);
  }
  50% {
    transform: perspective(100px) rotateX(180deg) rotateY(180deg);
  }
  75% {
    transform: perspective(100px) rotateX(0) rotateY(180deg);
  }
  100% {
    transform: perspective(100px) rotateX(0) rotateY(0);
  }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
