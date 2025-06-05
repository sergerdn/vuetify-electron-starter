<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2" color="primary">mdi-fingerprint</v-icon>
      <span>Fingerprint Browser Automation</span>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="!isElectron" type="warning" variant="tonal" class="mb-4">
        <v-icon>mdi-web</v-icon>
        Running in web browser. Fingerprint automation features are only available in Electron.
      </v-alert>

      <v-alert v-else-if="!isAvailable" type="error" variant="tonal" class="mb-4">
        <v-icon>mdi-microsoft-windows</v-icon>
        Fingerprint automation is only available on Windows operating system.
      </v-alert>

      <v-alert v-else type="success" variant="tonal" class="mb-4">
        <v-icon>mdi-check-circle</v-icon>
        Running in Electron on Windows! Fingerprint browser automation is available.
      </v-alert>

      <!-- Service Key Configuration -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-key</v-icon>
          Fingerprint Service Configuration
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="serviceKey"
            label="Fingerprint Service Key"
            prepend-icon="mdi-key"
            variant="outlined"
            :disabled="!isElectron || !isAvailable || loading.setKey"
            placeholder="Leave empty for free version"
            type="password"
            class="mb-2"
          />
          <v-btn
            @click="setServiceKey"
            :loading="loading.setKey"
            :disabled="!isElectron || !isAvailable"
            color="primary"
            variant="outlined"
            class="me-2"
          >
            <v-icon start>mdi-content-save</v-icon>
            Set Service Key
          </v-btn>
          <v-btn
            @click="loadServiceKey"
            :loading="loading.getKey"
            :disabled="!isElectron || !isAvailable"
            color="secondary"
            variant="outlined"
          >
            <v-icon start>mdi-refresh</v-icon>
            Load Current Key
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Fingerprint Management -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-fingerprint</v-icon>
          Fingerprint Management
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="urlToOpen"
                label="Website URL"
                prepend-icon="mdi-link"
                variant="outlined"
                :disabled="!isElectron || !isAvailable || loading.launch"
                :error="!isValidUrl"
                :error-messages="!isValidUrl ? 'Please enter a valid URL' : ''"
                placeholder="https://example.com"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                @click="fetchFingerprint"
                :loading="loading.fetch"
                :disabled="!isElectron || !isAvailable"
                color="secondary"
                size="large"
                block
              >
                <v-icon start>mdi-download</v-icon>
                Fetch New Fingerprint
              </v-btn>
            </v-col>
          </v-row>

          <v-textarea
            v-model="currentFingerprint"
            label="Current Fingerprint"
            prepend-icon="mdi-fingerprint"
            variant="outlined"
            :disabled="!isElectron || !isAvailable"
            rows="3"
            placeholder="Fingerprint data will appear here after fetching"
            class="mb-2"
          />

          <v-btn
            @click="launchBrowserWithFingerprint"
            :loading="loading.launch"
            :disabled="!isElectron || !isAvailable || !currentFingerprint || !isValidUrl"
            color="primary"
            size="large"
            class="me-2"
          >
            <v-icon start>mdi-rocket-launch</v-icon>
            Launch Chromium with Fingerprint
          </v-btn>

          <v-btn
            @click="clearFingerprint"
            :disabled="!currentFingerprint"
            color="error"
            variant="outlined"
            size="large"
          >
            <v-icon start>mdi-delete</v-icon>
            Clear Fingerprint
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Active Sessions -->
      <v-card v-if="activeSessions.length > 0" variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-monitor-multiple</v-icon>
          Active Fingerprint Sessions ({{ activeSessions.length }})
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="session in activeSessions"
              :key="session.processId"
              class="border rounded mb-2"
            >
              <template #prepend>
                <v-icon color="success">mdi-google-chrome</v-icon>
              </template>

              <v-list-item-title> Process ID: {{ session.processId }} </v-list-item-title>
              <v-list-item-subtitle>
                URL: {{ session.url }}<br />
                Fingerprint: {{ session.fingerprint }}<br />
                Started: {{ new Date(session.startTime).toLocaleString() }}
              </v-list-item-subtitle>

              <template #append>
                <v-btn
                  @click="closeBrowser(session.processId)"
                  :loading="loading.close === session.processId"
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

      <!-- Status Messages -->
      <v-alert
        v-if="statusMessage"
        :type="statusType"
        variant="tonal"
        class="mb-4"
        dismissible
        @click:close="clearStatus"
      >
        {{ statusMessage }}
      </v-alert>

      <!-- Information -->
      <v-card variant="outlined">
        <v-card-title>
          <v-icon class="me-2">mdi-information</v-icon>
          About Fingerprint Automation
        </v-card-title>
        <v-card-text>
          <p class="mb-2">
            <strong>Fingerprint browser automation</strong> uses the playwright-with-fingerprints
            library to launch browsers with modified fingerprints for enhanced privacy and stealth.
          </p>
          <v-chip color="info" variant="outlined" class="me-2 mb-2">
            <v-icon start>mdi-microsoft-windows</v-icon>
            Windows Only
          </v-chip>
          <v-chip color="warning" variant="outlined" class="me-2 mb-2">
            <v-icon start>mdi-google-chrome</v-icon>
            Chromium Only
          </v-chip>
          <v-chip color="success" variant="outlined" class="mb-2">
            <v-icon start>mdi-shield-check</v-icon>
            Enhanced Privacy
          </v-chip>
          <p class="mt-2 text-caption">
            Free version available with limited features. Premium service key provides access to
            advanced fingerprints and additional customization options.
          </p>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';

  // Reactive data
  const isElectron = ref(false);
  const isAvailable = ref(false);
  const serviceKey = ref('');
  const urlToOpen = ref('https://browserleaks.com/canvas');
  const currentFingerprint = ref('');
  const activeSessions = ref<
    Array<{
      processId: number;
      url: string;
      fingerprint: string;
      startTime: Date;
    }>
  >([]);

  const loading = ref({
    setKey: false,
    getKey: false,
    fetch: false,
    launch: false,
    close: null as number | null
  });

  const statusMessage = ref('');
  const statusType = ref<'success' | 'error' | 'warning' | 'info'>('info');

  // Computed properties
  const isValidUrl = computed(() => {
    try {
      new URL(urlToOpen.value);
      return true;
    } catch {
      return false;
    }
  });

  // Helper functions
  const showStatus = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    statusType.value = type;
    statusMessage.value = message;
    setTimeout(() => {
      statusMessage.value = '';
    }, 5000);
  };

  const clearStatus = () => {
    statusMessage.value = '';
  };

  // Check availability
  const checkAvailability = async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.fingerprintIsAvailable();
      if (result.success) {
        isAvailable.value = result.available || false;
        if (!result.available) {
          showStatus('warning', result.message);
        }
      } else {
        showStatus('error', result.message);
      }
    } catch (error) {
      showStatus('error', `Error checking availability: ${error}`);
    }
  };

  // Service key management
  const setServiceKey = async () => {
    if (!window.electronAPI) return;

    loading.value.setKey = true;
    try {
      const result = await window.electronAPI.fingerprintSetServiceKey(serviceKey.value);
      if (result.success) {
        showStatus('success', result.message);
      } else {
        showStatus('error', result.message);
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.setKey = false;
    }
  };

  const loadServiceKey = async () => {
    if (!window.electronAPI) return;

    loading.value.getKey = true;
    try {
      const result = await window.electronAPI.fingerprintGetServiceKey();
      if (result.success && result.key !== undefined) {
        serviceKey.value = result.key;
        showStatus('success', 'Service key loaded successfully');
      } else {
        showStatus('error', result.message || 'Failed to load service key');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.getKey = false;
    }
  };

  // Fingerprint management
  const fetchFingerprint = async () => {
    if (!window.electronAPI) return;

    loading.value.fetch = true;
    try {
      const result = await window.electronAPI.fingerprintFetch(['Microsoft Windows', 'Chrome']);
      if (result.success && result.fingerprint) {
        currentFingerprint.value = result.fingerprint;
        showStatus('success', 'Fingerprint fetched successfully');
      } else {
        showStatus('error', result.message);
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.fetch = false;
    }
  };

  const clearFingerprint = () => {
    currentFingerprint.value = '';
    showStatus('info', 'Fingerprint cleared');
  };

  // Browser management
  const launchBrowserWithFingerprint = async () => {
    if (!window.electronAPI || !currentFingerprint.value || !isValidUrl.value) {
      showStatus('error', 'Invalid fingerprint or URL');
      return;
    }

    loading.value.launch = true;
    try {
      const result = await window.electronAPI.fingerprintLaunchBrowser(
        urlToOpen.value,
        currentFingerprint.value
      );
      if (result.success && result.processId) {
        await loadActiveSessions();
        showStatus(
          'success',
          `Chromium launched successfully with fingerprint! Process ID: ${result.processId}`
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

  const closeBrowser = async (processId: number) => {
    if (!window.electronAPI) return;

    loading.value.close = processId;
    try {
      const result = await window.electronAPI.fingerprintCloseBrowser(processId);
      if (result.success) {
        activeSessions.value = activeSessions.value.filter(s => s.processId !== processId);
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

  const loadActiveSessions = async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.fingerprintGetActiveSessions();
      if (result.success && result.sessions) {
        activeSessions.value = result.sessions;
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  };

  // Lifecycle
  onMounted(async () => {
    // Check if running in Electron
    isElectron.value = !!window.electronAPI?.isElectron;

    if (isElectron.value) {
      await checkAvailability();
      await loadServiceKey();
      await loadActiveSessions();
    }
  });
</script>
