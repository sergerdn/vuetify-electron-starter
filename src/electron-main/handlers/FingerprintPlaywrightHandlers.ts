import { ipcMain } from 'electron';
import { FingerprintPlaywrightService } from '../services/FingerprintPlaywrightService';

/**
 * Handles IPC communication for fingerprint-enabled Playwright automation
 */
export class FingerprintPlaywrightHandlers {
  private fingerprintService: FingerprintPlaywrightService;

  constructor() {
    this.fingerprintService = new FingerprintPlaywrightService();
    this.registerHandlers();
    console.log('🔒 FingerprintPlaywrightHandlers initialized');
  }

  /**
   * Register all fingerprint Playwright-related IPC handlers
   */
  private registerHandlers(): void {
    // Handler to set a fingerprint service key
    ipcMain.handle('fingerprint-set-service-key', async (event, key: string) => {
      try {
        this.fingerprintService.setServiceKey(key);
        return { success: true, message: 'Service key set successfully' };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    // Handler to get current service key
    ipcMain.handle('fingerprint-get-service-key', async () => {
      try {
        const key = this.fingerprintService.getServiceKey();
        return { success: true, key };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    // Handler to fetch a new fingerprint
    ipcMain.handle(
      'fingerprint-fetch',
      async (event, tags: string[] = ['Microsoft Windows', 'Chrome']) => {
        return await this.fingerprintService.fetchFingerprint(tags);
      }
    );

    // Handler to launch browser with fingerprint
    ipcMain.handle(
      'fingerprint-launch-browser',
      async (event, url: string, fingerprint: string) => {
        return await this.fingerprintService.launchBrowserWithFingerprint(url, fingerprint);
      }
    );

    // Handler to close fingerprint browser
    ipcMain.handle('fingerprint-close-browser', async (event, processId: number) => {
      return await this.fingerprintService.closeBrowser(processId);
    });

    // Handler to get active fingerprint sessions
    ipcMain.handle('fingerprint-get-active-sessions', async () => {
      try {
        const sessions = this.fingerprintService.getActiveSessions();
        return { success: true, sessions };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    // Handler to check if fingerprint service is available
    ipcMain.handle('fingerprint-is-available', async () => {
      try {
        const available = this.fingerprintService.isAvailable();
        return {
          success: true,
          available,
          message: available
            ? 'Fingerprint service is available'
            : 'Fingerprint service is only available on Windows'
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    console.log('🔒 Fingerprint Playwright IPC handlers registered');
  }

  /**
   * Cleanup method to close all sessions when the app is closing
   */
  async cleanup(): Promise<void> {
    try {
      await this.fingerprintService.closeAllSessions();
      console.log('🔒 All fingerprint browser sessions closed');
    } catch (error) {
      console.error('Error during fingerprint service cleanup:', error);
    }
  }
}
