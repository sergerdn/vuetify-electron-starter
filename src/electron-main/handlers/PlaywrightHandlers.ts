import { ipcMain } from 'electron';
import { PlaywrightService } from '../services/PlaywrightService.js';

export class PlaywrightHandlers {
  private playwrightService: PlaywrightService;

  constructor() {
    this.playwrightService = new PlaywrightService();
    this.registerHandlers();
  }

  /**
   * Register all Playwright-related IPC handlers
   */
  private registerHandlers(): void {
    // Handler to launch the browser with Playwright
    ipcMain.handle('launch-browser', async (event, browser: 'chrome' | 'firefox', url: string) => {
      return await this.playwrightService.launchBrowser(browser, url);
    });

    // Handler to get available browsers
    ipcMain.handle('get-available-browsers', async () => {
      return await this.playwrightService.getAvailableBrowsers();
    });

    // Handler to close browser
    ipcMain.handle('close-browser', async (event, processId: number) => {
      return await this.playwrightService.closeBrowser(processId);
    });

    // Handler to get active sessions
    ipcMain.handle('get-active-sessions', async () => {
      try {
        const sessions = this.playwrightService.getActiveSessions();
        return { success: true, sessions };
      } catch (error) {
        console.error('Error getting active sessions:', error);
        return {
          success: false,
          sessions: [],
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    // Handler to get session details
    ipcMain.handle('get-session-details', async (event, processId: number) => {
      try {
        const session = this.playwrightService.getSession(processId);
        if (!session) {
          return { success: false, message: 'Session not found' };
        }

        return {
          success: true,
          session: {
            processId: session.processId,
            browserType: session.browserType,
            url: session.url,
            cdpPort: session.cdpPort,
            cdpUrl:
              session.browserType === 'chrome'
                ? `http://localhost:${session.cdpPort}`
                : `http://localhost:${session.cdpPort}`,
            startTime: session.startTime
          }
        };
      } catch (error) {
        console.error('Error getting session details:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    console.log('Playwright IPC handlers registered successfully');
  }

  /**
   * Clean up all browser sessions on app exit
   */
  async cleanup(): Promise<void> {
    try {
      await this.playwrightService.closeAllSessions();
      console.log('All Playwright browser sessions closed');
    } catch (error) {
      console.error('Error during Playwright cleanup:', error);
    }
  }

  /**
   * Get the Playwright service instance
   */
  getService(): PlaywrightService {
    return this.playwrightService;
  }
}
