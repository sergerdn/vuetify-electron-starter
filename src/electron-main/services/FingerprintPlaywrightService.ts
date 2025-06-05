import { plugin } from 'playwright-with-fingerprints';
import type { Browser, BrowserContext, Page } from 'playwright';
import path from 'path';
import { AppConfig } from '../../config/AppConfig.js';

export interface FingerprintBrowserSession {
  processId: number;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  fingerprint: string;
  url: string;
  startTime: Date;
}

export interface FingerprintLaunchResult {
  success: boolean;
  message: string;
  processId?: number;
  fingerprint?: string;
}

export interface FingerprintCloseResult {
  success: boolean;
  message: string;
}

export interface FingerprintFetchResult {
  success: boolean;
  fingerprint?: string;
  message: string;
}

/**
 * Service for managing Playwright browser automation with fingerprints
 * Only supports Chromium browser as per playwright-with-fingerprints limitations
 */
export class FingerprintPlaywrightService {
  private activeBrowsers = new Map<number, FingerprintBrowserSession>();
  private processIdCounter = 1;
  private serviceKey = '';
  private appConfig: AppConfig;

  constructor() {
    this.appConfig = new AppConfig();
    this.setupWorkingFolder();
    console.log('🔒 FingerprintPlaywrightService initialized');
  }

  /**
   * Setup the working folder for playwright-with-fingerprints engine
   */
  private setupWorkingFolder(): void {
    try {
      // Get the working folder from configuration
      const workingFolder = this.appConfig.playwrightFingerprints.workingFolder;

      // Resolve the path relative to the application root
      const resolvedPath = path.resolve(process.cwd(), workingFolder);

      // Set the working folder for the plugin
      plugin.setWorkingFolder(resolvedPath);

      console.log(`🔧 Playwright fingerprints working folder set to: ${resolvedPath}`);
    } catch (error) {
      console.error('❌ Error setting up working folder:', error);
      // Fallback to default if there's an error
      const fallbackPath = path.resolve(process.cwd(), '.data_playwright_with_fingerprints');
      plugin.setWorkingFolder(fallbackPath);
      console.log(`🔧 Using fallback working folder: ${fallbackPath}`);
    }
  }

  /**
   * Set the fingerprint service key
   */
  setServiceKey(key: string): void {
    this.serviceKey = key;
    plugin.setServiceKey(key);
    console.log(`🔑 Fingerprint service key ${key ? 'set' : 'cleared'}`);
  }

  /**
   * Get the current service key
   */
  getServiceKey(): string {
    return this.serviceKey;
  }

  /**
   * Get the current working folder path
   */
  getWorkingFolder(): string {
    return path.resolve(process.cwd(), this.appConfig.playwrightFingerprints.workingFolder);
  }

  /**
   * Fetch a new fingerprint from the service
   */
  async fetchFingerprint(
    tags: string[] = ['Microsoft Windows', 'Chrome']
  ): Promise<FingerprintFetchResult> {
    try {
      console.log('🎭 Fetching fingerprint with tags:', tags);

      const fingerprint = await plugin.fetch({
        tags: tags as any
      });

      console.log('✅ Fingerprint fetched successfully');
      return {
        success: true,
        fingerprint,
        message: 'Fingerprint fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching fingerprint:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Launch Chromium browser with fingerprint
   */
  async launchBrowserWithFingerprint(
    url: string,
    fingerprint: string
  ): Promise<FingerprintLaunchResult> {
    try {
      console.log(`🚀 Launching Chromium with fingerprint for URL: ${url}`);

      const processId = this.processIdCounter++;

      // Apply the fingerprint
      plugin.useFingerprint(fingerprint);

      // Launch the browser with fingerprint
      const browser = await plugin.launch({
        headless: false,
        args: [
          '--disk-cache-size=5000000',
          '--disable-features=CookieDeprecationFacilitatedTesting,OptimizationGuideModelDownloading,ReportEcn',
          '--lang=en',
          '--disable-auto-reload'
        ]
      });

      // Create a new page directly (no need for a separate context)
      const page = await browser.newPage();

      // Navigate to the URL
      console.log(`🌐 Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Get browser info for verification
      console.log(`✅ Browser with fingerprint launched successfully!`);
      console.log(`   Browser: Chromium with fingerprint`);
      console.log(`   Process ID: ${processId}`);

      // Store the browser session
      const session: FingerprintBrowserSession = {
        processId,
        browser: browser as any, // playwright-with-fingerprints returns a compatible browser
        context: page.context(),
        page,
        fingerprint,
        url,
        startTime: new Date()
      };

      this.activeBrowsers.set(processId, session);

      return {
        success: true,
        message: 'Browser with fingerprint launched successfully',
        processId,
        fingerprint
      };
    } catch (error) {
      console.error('❌ Error launching browser with fingerprint:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Close browser session
   */
  async closeBrowser(processId: number): Promise<FingerprintCloseResult> {
    try {
      const session = this.activeBrowsers.get(processId);
      if (!session) {
        return { success: false, message: 'Browser session not found' };
      }

      // Close browser and release resources
      await session.browser.close();
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
    url: string;
    fingerprint: string;
    startTime: Date;
  }> {
    return Array.from(this.activeBrowsers.values()).map(session => ({
      processId: session.processId,
      url: session.url,
      fingerprint: session.fingerprint.substring(0, 50) + '...', // Truncate for display
      startTime: session.startTime
    }));
  }

  /**
   * Get browser session by process ID
   */
  getSession(processId: number): FingerprintBrowserSession | undefined {
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

  /**
   * Check if the service is available (Windows only)
   */
  isAvailable(): boolean {
    return process.platform === 'win32';
  }
}
