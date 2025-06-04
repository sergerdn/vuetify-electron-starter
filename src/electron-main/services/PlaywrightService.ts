import { chromium, firefox } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';

export interface BrowserSession {
  processId: number;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  cdpPort: number;
  browserType: 'chrome' | 'firefox';
  url: string;
  startTime: Date;
}

export interface BrowserInfo {
  name: 'chrome' | 'firefox';
  displayName: string;
  available: boolean;
}

export interface LaunchResult {
  success: boolean;
  message: string;
  processId?: number;
  cdpPort?: number;
  cdpUrl?: string;
}

export interface BrowserListResult {
  success: boolean;
  browsers: BrowserInfo[];
}

export interface CloseResult {
  success: boolean;
  message: string;
}

export class PlaywrightService {
  private activeBrowsers = new Map<number, BrowserSession>();
  private processIdCounter = 1;
  private readonly CDP_PORT_START = 9222;
  private usedPorts = new Set<number>();

  /**
   * Get next available CDP port
   */
  private getNextCdpPort(): number {
    let port = this.CDP_PORT_START;
    while (this.usedPorts.has(port)) {
      port++;
    }
    this.usedPorts.add(port);
    return port;
  }

  /**
   * Release CDP port
   */
  private releaseCdpPort(port: number): void {
    this.usedPorts.delete(port);
  }

  /**
   * Launch browser with Playwright automation
   */
  async launchBrowser(browserType: 'chrome' | 'firefox', url: string): Promise<LaunchResult> {
    try {
      console.log(`🚀 Launching ${browserType} with Playwright automation for URL: ${url}`);
      console.log(`📊 CDP Port: ${this.getNextCdpPort()}`);

      const processId = this.processIdCounter++;
      const cdpPort = this.getNextCdpPort();
      let browser: Browser;

      switch (browserType) {
        case 'chrome':
          // Launch Chrome with CDP enabled
          browser = await chromium.launch({
            headless: false,
            channel: 'chrome', // Use system Chrome
            args: [
              `--remote-debugging-port=${cdpPort}`,
              '--disable-blink-features=AutomationControlled',
              '--disk-cache-size=524288000', // 500 MB
              '--disable-infobars',
              '--no-sandbox'
            ]
          });
          break;

        case 'firefox':
          // Launch Firefox with remote debugging
          browser = await firefox.launch({
            headless: false,
            args: ['--no-sandbox', `--start-debugger-server=${cdpPort}`]
          });
          break;

        default:
          return { success: false, message: 'Unsupported browser type' };
      }

      // Create browser context and page
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US,en,ru',
        geolocation: {
          latitude: 55.782463,
          longitude: 37.596637,
          accuracy: 90
        },
        timezoneId: 'Europe/Moscow',
        permissions: ['geolocation'],
        ignoreHTTPSErrors: true
      });

      const page = await context.newPage();

      // Navigate to the URL
      console.log(`🌐 Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Get browser info for verification
      const browserVersion = browser.version();
      console.log(`✅ Browser launched successfully!`);
      console.log(`   Browser: ${browserType} (${browserVersion})`);
      console.log(`   CDP Port: ${cdpPort}`);
      console.log(`   Process ID: ${processId}`);

      // Store the browser session
      const session: BrowserSession = {
        processId,
        browser,
        context,
        page,
        cdpPort,
        browserType,
        url,
        startTime: new Date()
      };

      this.activeBrowsers.set(processId, session);

      const cdpUrl =
        browserType === 'chrome' ? `http://localhost:${cdpPort}` : `http://localhost:${cdpPort}`;

      console.log(
        `🎯 ${browserType} ready for automation - Process ID: ${processId}, CDP: ${cdpUrl}`
      );

      return {
        success: true,
        message: `${browserType} launched successfully with Playwright automation`,
        processId,
        cdpPort,
        cdpUrl
      };
    } catch (error) {
      console.error(`Error launching ${browserType}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get available browsers
   */
  async getAvailableBrowsers(): Promise<BrowserListResult> {
    try {
      const browsers: BrowserInfo[] = [];

      // Check Chrome availability
      try {
        const testBrowser = await chromium.launch({
          headless: true,
          channel: 'chrome',
          timeout: 5000
        });
        await testBrowser.close();
        browsers.push({
          name: 'chrome',
          displayName: 'Google Chrome',
          available: true
        });
      } catch (error) {
        console.log('Chrome not available:', error);
        browsers.push({
          name: 'chrome',
          displayName: 'Google Chrome',
          available: false
        });
      }

      // Check Firefox availability
      try {
        const testBrowser = await firefox.launch({
          headless: true,
          timeout: 5000
        });
        await testBrowser.close();
        browsers.push({
          name: 'firefox',
          displayName: 'Mozilla Firefox',
          available: true
        });
      } catch (error) {
        console.log('Firefox not available:', error);
        browsers.push({
          name: 'firefox',
          displayName: 'Mozilla Firefox',
          available: false
        });
      }

      return { success: true, browsers };
    } catch (error) {
      console.error('Error getting available browsers:', error);
      return {
        success: false,
        browsers: []
      };
    }
  }

  /**
   * Close browser session
   */
  async closeBrowser(processId: number): Promise<CloseResult> {
    try {
      const session = this.activeBrowsers.get(processId);
      if (!session) {
        return { success: false, message: 'Browser session not found' };
      }

      // Close browser and release resources
      await session.browser.close();
      this.releaseCdpPort(session.cdpPort);
      this.activeBrowsers.delete(processId);

      console.log(`Browser session ${processId} closed successfully`);
      return { success: true, message: 'Browser session closed successfully' };
    } catch (error) {
      console.error('Error closing browser:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get active browser sessions
   */
  getActiveSessions(): Array<{
    processId: number;
    browserType: 'chrome' | 'firefox';
    url: string;
    cdpPort: number;
    startTime: Date;
  }> {
    return Array.from(this.activeBrowsers.values()).map(session => ({
      processId: session.processId,
      browserType: session.browserType,
      url: session.url,
      cdpPort: session.cdpPort,
      startTime: session.startTime
    }));
  }

  /**
   * Get browser session by process ID
   */
  getSession(processId: number): BrowserSession | undefined {
    return this.activeBrowsers.get(processId);
  }

  /**
   * Close all browser sessions
   */
  async closeAllSessions(): Promise<void> {
    const promises = Array.from(this.activeBrowsers.keys()).map(processId =>
      this.closeBrowser(processId)
    );
    await Promise.all(promises);
  }
}
