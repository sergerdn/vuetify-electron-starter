<template>
  <v-container class="fill-height" max-width="900">
    <div>
      <v-img class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">Vuetify</h1>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold"> Get started </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Change this page by updating <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in
                <v-kbd>components/HelloWorld.vue</v-kbd>.
              </div>
            </template>
          </v-card>
        </v-col>

        <!-- Electron OS Integration Test -->
        <v-col cols="12">
          <v-card class="py-4" color="primary" rounded="lg" variant="tonal">
            <v-card-title class="text-center">
              <v-icon class="me-2">mdi-desktop-classic</v-icon>
              Electron OS Integration Test
            </v-card-title>

            <v-card-text class="text-center">
              <p class="mb-4">Test communication between Vue app and Electron main process</p>

              <v-btn
                @click="openGoogleInChrome"
                :loading="loading"
                :disabled="!isElectron"
                color="primary"
                size="large"
                class="me-2 mb-2"
              >
                <v-icon start>mdi-google-chrome</v-icon>
                Open Google in Chrome
              </v-btn>

              <v-btn
                @click="showSystemInfo"
                :loading="loadingInfo"
                :disabled="!isElectron"
                color="secondary"
                size="large"
                class="me-2 mb-2"
              >
                <v-icon start>mdi-information</v-icon>
                Show System Info
              </v-btn>

              <v-btn
                @click="sendNotification"
                :loading="loadingNotification"
                :disabled="!isElectron"
                color="success"
                size="large"
                class="mb-2"
              >
                <v-icon start>mdi-bell</v-icon>
                Send Notification
              </v-btn>

              <v-alert v-if="!isElectron" type="warning" variant="tonal" class="mt-4">
                <v-icon>mdi-web</v-icon>
                Running in web browser. OS integration only works in Electron app.
              </v-alert>

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

              <v-card v-if="systemInfo" variant="outlined" class="mt-4 text-start">
                <v-card-title>System Information</v-card-title>
                <v-card-text>
                  <v-chip
                    v-for="(value, key) in systemInfo"
                    :key="key"
                    :text="`${key}: ${value}`"
                    variant="outlined"
                    size="small"
                    class="me-2 mb-2"
                  />
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :href="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"
            target="_blank"
            :title="link.title"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  // Existing links data
  const links = [
    {
      href: 'https://vuetifyjs.com/',
      icon: 'mdi-text-box-outline',
      subtitle: 'Learn about all things Vuetify in our documentation.',
      title: 'Documentation'
    },
    {
      href: 'https://vuetifyjs.com/introduction/why-vuetify/#feature-guides',
      icon: 'mdi-star-circle-outline',
      subtitle: 'Explore available framework Features.',
      title: 'Features'
    },
    {
      href: 'https://vuetifyjs.com/components/all',
      icon: 'mdi-widgets-outline',
      subtitle: 'Discover components in the API Explorer.',
      title: 'Components'
    },
    {
      href: 'https://discord.vuetifyjs.com',
      icon: 'mdi-account-group-outline',
      subtitle: 'Connect with Vuetify developers.',
      title: 'Community'
    }
  ];

  // Electron integration reactive data
  const isElectron = ref(false);
  const loading = ref(false);
  const loadingInfo = ref(false);
  const loadingNotification = ref(false);
  const systemInfo = ref<Record<string, string> | null>(null);
  const statusMessage = ref<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Helper function to show status messages
  const showStatus = (type: 'success' | 'error' | 'warning', text: string) => {
    statusMessage.value = { type, text };
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  };

  // OS Integration functions
  const openGoogleInChrome = async () => {
    if (!window.electronAPI) {
      showStatus('error', 'Electron API not available');
      return;
    }

    loading.value = true;
    try {
      const result = await window.electronAPI.openExternalUrl('https://google.com');
      if (result.success) {
        showStatus('success', 'Google opened in Chrome browser!');
      } else {
        showStatus('error', result.message || 'Failed to open Google');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loading.value = false;
    }
  };

  const showSystemInfo = async () => {
    if (!window.electronAPI) {
      showStatus('error', 'Electron API not available');
      return;
    }

    loadingInfo.value = true;
    try {
      const result = await window.electronAPI.getSystemInfo();
      if (result.success && result.data) {
        systemInfo.value = result.data;
        showStatus('success', 'System information retrieved!');
      } else {
        showStatus('error', result.message || 'Failed to get system info');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loadingInfo.value = false;
    }
  };

  const sendNotification = async () => {
    if (!window.electronAPI) {
      showStatus('error', 'Electron API not available');
      return;
    }

    loadingNotification.value = true;
    try {
      const result = await window.electronAPI.showNotification(
        'Hello from Electron!',
        'This is a test notification from your Vue + Electron app!'
      );
      if (result.success) {
        showStatus('success', 'Notification sent successfully!');
      } else {
        showStatus('error', result.message || 'Failed to send notification');
      }
    } catch (error) {
      showStatus('error', `Error: ${error}`);
    } finally {
      loadingNotification.value = false;
    }
  };

  // Check if running in Electron on component mount
  onMounted(() => {
    isElectron.value = !!window.electronAPI?.isElectron;

    if (isElectron.value) {
      console.log('🎉 Running in Electron! OS integration features available.');
    } else {
      console.log('🌐 Running in web browser. OS integration features disabled.');
    }
  });
</script>
