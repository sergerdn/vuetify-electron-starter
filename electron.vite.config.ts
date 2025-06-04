import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Fonts from 'unplugin-fonts/vite';
import Layouts from 'vite-plugin-vue-layouts-next';
import VueRouter from 'unplugin-vue-router/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import { resolve } from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'build-electron/electron-main',
      rollupOptions: {
        input: resolve(__dirname, 'src/electron-main/index.ts')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'build-electron/electron-preload',
      rollupOptions: {
        input: resolve(__dirname, 'src/electron-preload/index.ts')
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'build-electron/renderer',
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          // Disable font preloading to avoid MIME type issues in Electron
          manualChunks: undefined
        }
      },
      // Disable preload links for fonts to avoid MIME type warnings
      modulePreload: false,
      // Disable asset inlining to prevent font preload issues
      assetsInlineLimit: 0
    },
    optimizeDeps: {
      exclude: [
        'vuetify',
        'vue-router',
        'unplugin-vue-router/runtime',
        'unplugin-vue-router/data-loaders',
        'unplugin-vue-router/data-loaders/basic'
      ]
    },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      VueRouter({
        dts: 'src/typed-router.d.ts'
      }),
      Layouts(),
      AutoImport({
        imports: [
          'vue',
          VueRouterAutoImports,
          {
            pinia: ['defineStore', 'storeToRefs']
          }
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        },
        vueTemplate: true
      }),
      Components({
        dts: 'src/components.d.ts'
      }),
      vue({
        template: { transformAssetUrls }
      }),
      vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss'
        }
      }),
      Fonts({
        fontsource: {
          families: [
            {
              name: 'Roboto',
              weights: [400, 500, 700], // Reduce font weights to minimize preload links
              styles: ['normal']
            }
          ]
        }
      })
    ],
    define: { 'process.env': {} },
    server: {
      port: 3000
    },
    css: {
      preprocessorOptions: {
        sass: {
          // Configuration for sass if needed
        },
        scss: {
          // Configuration for scss if needed
        }
      }
    }
  }
});
