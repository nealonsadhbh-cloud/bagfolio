import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        comh: resolve(__dirname, 'Comh.html'),
        'comh-loader': resolve(__dirname, 'src/comh-loader.js'),
      },
      output: {
        assetFileNames: '[name][extname]'
      }
    }
  }
})
