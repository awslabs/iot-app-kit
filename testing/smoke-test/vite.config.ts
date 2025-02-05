import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /*
     * This plugin is required to resolve the charts-core module as they are dynamically imported
     * when the library is loaded.
     * See the dynamic loading code here: https://github.com/ionic-team/stencil/blob/main/src/client/client-load-module.ts#L32
     * Unfortunately, we are using an older version of the stencil library which doesn't use the syntax vite supports to
     * detect the dynamic imports automatically, so we need to use this plugin to explicitly tell vite to include the
     * charts-core module otherwise their code will not be included in the build.
     */
    dynamicImport({
      filter(id) {
        // `node_modules` is exclude by default, so we need to include it explicitly
        // https://github.com/vite-plugin/vite-plugin-dynamic-import/blob/v1.3.0/src/index.ts#L133-L135
        if (id.includes('/node_modules/@iot-app-kit/charts-core')) {
          console.log('dynamically import entry point', id);
          return true;
        }
      },
      onFiles(files) {
        console.log('dynamically import files', files);
      },
    }),
  ],
});
