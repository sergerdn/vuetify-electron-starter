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

  // Playwright browser automation APIs
  launchBrowser: (browser: 'chrome' | 'firefox', url: string) => Promise<{
    success: boolean;
    message: string;
    processId?: number;
    cdpPort?: number;
    cdpUrl?: string;
  }>;

  // Get available browsers
  getAvailableBrowsers: () => Promise<{
    success: boolean;
    browsers: Array<{
      name: 'chrome' | 'firefox';
      displayName: string;
      available: boolean;
    }>;
  }>;

  // Close the browser process
  closeBrowser: (processId: number) => Promise<{ success: boolean; message: string }>;

  // Get active browser sessions
  getActiveSessions: () => Promise<{
    success: boolean;
    sessions: Array<{
      processId: number;
      browserType: 'chrome' | 'firefox';
      url: string;
      cdpPort: number;
      startTime: Date;
    }>;
  }>;

  // Get session details
  getSessionDetails: (processId: number) => Promise<{
    success: boolean;
    session?: {
      processId: number;
      browserType: 'chrome' | 'firefox';
      url: string;
      cdpPort: number;
      cdpUrl: string;
      startTime: Date;
    };
    message?: string;
  }>;

  // Fingerprint Playwright APIs
  // Set fingerprint service key
  fingerprintSetServiceKey: (key: string) => Promise<{ success: boolean; message: string }>;

  // Get current fingerprint service key
  fingerprintGetServiceKey: () => Promise<{ success: boolean; key?: string; message?: string }>;

  // Fetch a new fingerprint
  fingerprintFetch: (tags?: string[]) => Promise<{
    success: boolean;
    fingerprint?: string;
    message: string;
  }>;

  // Launch browser with fingerprint (Chromium only)
  fingerprintLaunchBrowser: (url: string, fingerprint: string) => Promise<{
    success: boolean;
    message: string;
    processId?: number;
    fingerprint?: string;
  }>;

  // Close fingerprint browser
  fingerprintCloseBrowser: (processId: number) => Promise<{ success: boolean; message: string }>;

  // Get active fingerprint sessions
  fingerprintGetActiveSessions: () => Promise<{
    success: boolean;
    sessions?: Array<{
      processId: number;
      url: string;
      fingerprint: string;
      startTime: Date;
    }>;
    message?: string;
  }>;

  // Check if fingerprint service is available (Windows only)
  fingerprintIsAvailable: () => Promise<{
    success: boolean;
    available?: boolean;
    message: string;
  }>;

  // Get working folder information
  fingerprintGetWorkingFolder: () => Promise<{
    success: boolean;
    workingFolder?: string;
    message: string;
  }>;
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI;
    electronAPI: ElectronAPI;
  }
}
