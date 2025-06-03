/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes } from 'vue-router/auto-routes';

// CRITICAL: Use hash history for Electron to work with file:// protocol
//
// WHY THIS IS NEEDED:
// - Electron production builds use file:// protocol to load local files
// - HTML5 History API (createWebHistory) doesn't work with file:// protocol
// - Hash history (createWebHashHistory) works correctly with file:// protocol
// - Development mode uses Vite dev server (http://localhost:3000) so web history works
//
// DO NOT CHANGE THIS LOGIC WITHOUT TESTING ELECTRON PRODUCTION BUILDS!
// Changing this will cause a black screen in built Electron applications.

const isDev = import.meta.env.DEV;
const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:';

// Use hash history if it's a production build or file:// protocol
const useHashHistory = !isDev || isFileProtocol;

// Debug logging to help with future troubleshooting
if (typeof window !== 'undefined') {
  console.log('🔧 Router Configuration Debug:', {
    isDev,
    isFileProtocol,
    useHashHistory,
    protocol: window.location.protocol,
    href: window.location.href,
    historyMode: useHashHistory ? 'hash' : 'web'
  });
}

const history = useHashHistory
  ? createWebHashHistory(import.meta.env.BASE_URL)
  : createWebHistory(import.meta.env.BASE_URL);

const router = createRouter({
  history,
  routes: setupLayouts(routes)
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err);
    } else {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
