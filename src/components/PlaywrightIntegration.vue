<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2" color="primary">mdi-web</v-icon>
      <span>Playwright Browser Automation</span>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="!isElectron" type="warning" variant="tonal" class="mb-4">
        <v-icon>mdi-web</v-icon>
        Running in web browser. Playwright automation features are only available in Electron.
      </v-alert>

      <v-alert v-else type="success" variant="tonal" class="mb-4">
        <v-icon>mdi-check-circle</v-icon>
        Running in Electron! Playwright browser automation is available.
      </v-alert>

      <!-- Browser Selection and URL Input -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-rocket-launch</v-icon>
          Launch Browser
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedBrowser"
                :items="availableBrowsers"
                item-title="displayName"
                item-value="name"
                label="Select Browser"
                prepend-icon="mdi-web"
                variant="outlined"
                :disabled="!isElectron || loading.launch"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>
                        {{ item.raw.name === 'chrome' ? 'mdi-google-chrome' : 'mdi-firefox' }}
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="urlToOpen"
                label="URL to Open"
                prepend-icon="mdi-link"
                variant="outlined"
                :disabled="!isElectron || loading.launch"
                :error="!isValidUrl"
                :error-messages="!isValidUrl ? 'Please enter a valid URL' : ''"
                placeholder="https://example.com"
              />
            </v-col>
          </v-row>

          <v-btn
            @click="launchBrowser"
            :loading="loading.launch"
            :disabled="!isElectron || !selectedBrowser || !isValidUrl"
            color="primary"
            size="large"
            class="mt-2"
          >
            <v-icon start>mdi-rocket-launch</v-icon>
            Launch {{ selectedBrowser === 'chrome' ? 'Chrome' : 'Firefox' }}
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Active Browser Sessions -->
      <v-card v-if="activeBrowsers.length > 0" variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-monitor-multiple</v-icon>
          Active Browser Sessions
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="browser in activeBrowsers" :key="browser.processId" class="mb-2">
              <template #prepend>
                <v-icon>
                  {{ browser.browser === 'chrome' ? 'mdi-google-chrome' : 'mdi-firefox' }}
                </v-icon>
              </template>

              <v-list-item-title>
                {{ browser.browser === 'chrome' ? 'Google Chrome' : 'Mozilla Firefox' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Process ID: {{ browser.processId }} | URL: {{ browser.url }}
                <br />
                CDP Port: {{ browser.cdpPort }} | CDP URL: {{ browser.cdpUrl }}
              </v-list-item-subtitle>

              <template #append>
                <v-btn
                  @click="closeBrowser(browser.processId)"
                  :loading="loading.close === browser.processId"
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  <v-icon>mdi-close</v-icon>
                  Close
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Available Browsers Info -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-information</v-icon>
          Available Browsers
        </v-card-title>
        <v-card-text>
          <v-btn
            @click="loadAvailableBrowsers"
            :loading="loading.browsers"
            :disabled="!isElectron"
            color="secondary"
            variant="outlined"
            class="mb-3"
          >
            <v-icon start>mdi-refresh</v-icon>
            Refresh Browser List
          </v-btn>

          <v-list v-if="availableBrowsers.length > 0">
            <v-list-item v-for="browser in availableBrowsers" :key="browser.name">
              <template #prepend>
                <v-icon :color="browser.available ? 'success' : 'error'">
                  {{ browser.name === 'chrome' ? 'mdi-google-chrome' : 'mdi-firefox' }}
                </v-icon>
              </template>

              <v-list-item-title>{{ browser.displayName }}</v-list-item-title>
              <v-list-item-subtitle>
                Status: {{ browser.available ? 'Available' : 'Not Available' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Status Messages -->
      <v-alert
        v-if="statusMessage"
        :type="statusMessage.type"
        variant="tonal"
        class="mt-4"
        closable
        @click:close="statusMessage = null"
      >
        {{ statusMessage.text }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';

  // Reactive data
  const isElectron = ref(false);
  const selectedBrowser = ref<'chrome' | 'firefox'>('chrome');
  const urlToOpen = ref('https://google.com');
  const availableBrowsers = ref<
    Array<{
      name: 'chrome' | 'firefox';
      displayName: string;
      available: boolean;
    }>
  >([]);
  const activeBrowsers = ref<
    Array<{
      processId: number;
      browser: 'chrome' | 'firefox';
      url: string;
      cdpPort: number;
      cdpUrl: string;
    }>
  >([]);

  const loading = ref({
    launch: false,
    browsers: false,
    close: null as number | null
  });

  const statusMessage = ref<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Computed properties
  const isValidUrl = computed(() => {
    try {
      new URL(urlToOpen.value);
      return true;
    } catch {
      return false;
    }
  });

  // Helper function to show status messages
  const showStatus = (type: 'success' | 'error' | 'warning', text: string) => {
    statusMessage.value = { type, text };
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  };

  // Load available browsers
  const loadAvailableBrowsers = async () => {
    if (!window.electronAPI) {
      showStatus('error', 'Electron API not available');
      return;
    }

    loading.value.browsers = true;
    try {
      const result = await window.electronAPI.getAvailableBrowsers();
      if (result.success) {
        availableBrowsers.value = result.browsers;
        showStatus('success', 'Browser list updated successfully');
      } else {
        showStatus('error', 'Failed to get available browsers');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.browsers = false;
    }
  };

  // Launch browser with Playwright
  const launchBrowser = async () => {
    if (!window.electronAPI || !selectedBrowser.value || !isValidUrl.value) {
      showStatus('error', 'Invalid browser selection or URL');
      return;
    }

    loading.value.launch = true;
    try {
      const result = await window.electronAPI.launchBrowser(selectedBrowser.value, urlToOpen.value);
      if (result.success && result.processId) {
        activeBrowsers.value.push({
          processId: result.processId,
          browser: selectedBrowser.value,
          url: urlToOpen.value,
          cdpPort: result.cdpPort || 0,
          cdpUrl: result.cdpUrl || ''
        });
        showStatus(
          'success',
          `${selectedBrowser.value} launched successfully! CDP Port: ${result.cdpPort}`
        );
      } else {
        showStatus('error', result.message || 'Failed to launch browser');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.launch = false;
    }
  };

  // Close browser
  const closeBrowser = async (processId: number) => {
    if (!window.electronAPI) return;

    loading.value.close = processId;
    try {
      const result = await window.electronAPI.closeBrowser(processId);
      if (result.success) {
        activeBrowsers.value = activeBrowsers.value.filter(b => b.processId !== processId);
        showStatus('success', 'Browser closed successfully');
      } else {
        showStatus('error', result.message || 'Failed to close browser');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.close = null;
    }
  };

  // Lifecycle
  onMounted(() => {
    // Check if running in Electron
    isElectron.value = !!window.electronAPI?.isElectron;

    // Auto-load available browsers if in Electron
    if (isElectron.value) {
      loadAvailableBrowsers();
    }
  });
</script>
