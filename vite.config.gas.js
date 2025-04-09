import { defineConfig } from 'vite';
import { resolve } from 'path';
// import { AppsScriptPlugin } from './vite-plugin/vite-plugin-appsscript.js';
import { GoogleAppsScriptExportsPlugin } from './vite-plugin/vite-plugin-appsscript.js';

export default defineConfig({
  // plugins: [AppsScriptPlugin('dist/server/server.iife.js', 'randomizeCellColors')],
  plugins: [GoogleAppsScriptExportsPlugin()],
  build: {
    minify: false,
    outDir: resolve(process.cwd(), 'dist/server'),
    lib: {
      entry: resolve(process.cwd(), 'src/server/server.js'),
      name: 'lib_',
      fileName: 'server',
      formats: ['iife'],
    },
  },
});
