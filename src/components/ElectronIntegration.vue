<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2" color="primary">mdi-desktop-classic</v-icon>
      <span>Electron OS Integration</span>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="!isElectron" type="warning" variant="tonal" class="mb-4">
        <v-icon>mdi-web</v-icon>
        Running in web browser. OS integration features are only available in Electron.
      </v-alert>

      <v-alert v-else type="success" variant="tonal" class="mb-4">
        <v-icon>mdi-check-circle</v-icon>
        Running in Electron! OS integration features are available.
      </v-alert>

      <!-- System Information -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="me-2">mdi-information</v-icon>
            System Information
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-btn
              @click="getSystemInfo"
              :loading="loading.systemInfo"
              color="primary"
              variant="outlined"
              class="mb-3"
            >
              <v-icon start>mdi-refresh</v-icon>
              Get System Info
            </v-btn>

            <v-card v-if="systemInfo" variant="outlined">
              <v-card-text>
                <v-row dense>
                  <v-col v-for="(value, key) in systemInfo" :key="key" cols="6">
                    <v-chip
                      :text="`${key}: ${value}`"
                      variant="outlined"
                      size="small"
                      class="mb-1"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- External Browser Integration -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title>
          <v-icon class="me-2">mdi-web</v-icon>
          External Browser Integration
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-3">
            Open websites in Chrome browser (or default browser if Chrome is not available)
          </p>

          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="urlToOpen"
                label="Enter URL to open"
                placeholder="https://example.com"
                variant="outlined"
                density="compact"
                :rules="urlRules"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                @click="openExternalUrl"
                :loading="loading.openUrl"
                :disabled="!isValidUrl || !isElectron"
                color="primary"
                block
                size="large"
              >
                <v-icon start>mdi-open-in-new</v-icon>
                Open in Chrome
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-3" />

          <p class="text-body-2 mb-2">Quick Links:</p>
          <v-btn-group variant="outlined" density="compact">
            <v-btn @click="openQuickUrl('https://google.com')" :disabled="!isElectron">
              <v-icon start>mdi-google</v-icon>
              Google
            </v-btn>
            <v-btn @click="openQuickUrl('https://github.com')" :disabled="!isElectron">
              <v-icon start>mdi-github</v-icon>
              GitHub
            </v-btn>
            <v-btn @click="openQuickUrl('https://vuetifyjs.com')" :disabled="!isElectron">
              <v-icon start>mdi-vuetify</v-icon>
              Vuetify
            </v-btn>
          </v-btn-group>
        </v-card-text>
      </v-card>

      <!-- Native Notifications -->
      <v-card variant="outlined">
        <v-card-title>
          <v-icon class="me-2">mdi-bell</v-icon>
          Native Notifications
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-3"> Send native OS notifications from your Electron app </p>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="notification.title"
                label="Notification Title"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="notification.body"
                label="Notification Body"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>

          <v-btn
            @click="showNotification"
            :loading="loading.notification"
            :disabled="!notification.title || !notification.body || !isElectron"
            color="primary"
            variant="outlined"
          >
            <v-icon start>mdi-bell-ring</v-icon>
            Show Notification
          </v-btn>
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
  const systemInfo = ref<Record<string, string> | null>(null);
  const urlToOpen = ref('https://google.com');
  const notification = ref({
    title: 'Hello from Electron!',
    body: 'This is a native notification from your Electron app.'
  });

  const loading = ref({
    systemInfo: false,
    openUrl: false,
    notification: false
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

  const urlRules = [
    (v: string) => !!v || 'URL is required',
    (v: string) => {
      try {
        new URL(v);
        return true;
      } catch {
        return 'Please enter a valid URL';
      }
    }
  ];

  // Methods
  const showStatus = (type: 'success' | 'error' | 'warning', text: string) => {
    statusMessage.value = { type, text };
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  };

  const getSystemInfo = async () => {
    if (!window.electronAPI) {
      showStatus('error', 'Electron API not available');
      return;
    }

    loading.value.systemInfo = true;
    try {
      const result = await window.electronAPI.getSystemInfo();
      if (result.success && result.data) {
        systemInfo.value = result.data;
        showStatus('success', 'System information retrieved successfully');
      } else {
        showStatus('error', result.message || 'Failed to get system information');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.systemInfo = false;
    }
  };

  const openExternalUrl = async () => {
    if (!window.electronAPI || !isValidUrl.value) return;

    loading.value.openUrl = true;
    try {
      const result = await window.electronAPI.openExternalUrl(urlToOpen.value);
      if (result.success) {
        showStatus('success', `Opened ${urlToOpen.value} in external browser`);
      } else {
        showStatus('error', result.message || 'Failed to open URL');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.openUrl = false;
    }
  };

  const openQuickUrl = async (url: string) => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.openExternalUrl(url);
      if (result.success) {
        showStatus('success', `Opened ${url} in external browser`);
      } else {
        showStatus('error', result.message || 'Failed to open URL');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    }
  };

  const showNotification = async () => {
    if (!window.electronAPI) return;

    loading.value.notification = true;
    try {
      const result = await window.electronAPI.showNotification(
        notification.value.title,
        notification.value.body
      );
      if (result.success) {
        showStatus('success', 'Notification sent successfully');
      } else {
        showStatus('error', result.message || 'Failed to show notification');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value.notification = false;
    }
  };

  // Lifecycle
  onMounted(() => {
    // Check if running in Electron
    isElectron.value = !!window.electronAPI?.isElectron;

    // Auto-load system info if in Electron
    if (isElectron.value) {
      getSystemInfo();
    }
  });
</script>
