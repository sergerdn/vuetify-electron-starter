export interface IElectronAPI {
  on: (channel: string, callback: (...args: any[]) => void) => void
  off: (channel: string, callback?: (...args: any[]) => void) => void
  send: (channel: string, ...args: any[]) => void
  invoke: (channel: string, ...args: any[]) => Promise<any>
}

// OS Integration API Types
export interface ElectronAPI {
  // Open URL in an external browser (Chrome if available)
  openExternalUrl: (url: string) => Promise<{ success: boolean; message: string }>;

  // Get system information
  getSystemInfo: () => Promise<{
    success: boolean;
    data?: {
      platform: string;
      arch: string;
      version: string;
      electronVersion: string;
      chromeVersion: string;
      nodeVersion: string;
      appVersion: string;
      appName: string;
    };
    message?: string;
  }>;

  // Show native notification
  showNotification: (title: string, body: string) => Promise<{ success: boolean; message: string }>;

  // Check if running in Electron
  isElectron: boolean;

  // Get platform info
  platform: string;
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI;
    electronAPI: ElectronAPI;
  }
}
