import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        comh: resolve(__dirname, 'public/Comh.html'),
        archive: resolve(__dirname, 'public/Archive.html'),
        arglasses: resolve(__dirname, 'public/ARGlasses.html'),
        commercial: resolve(__dirname, 'public/Commercial.html'),
        emrld: resolve(__dirname, 'public/EMRLD.html'),
        leisure: resolve(__dirname, 'public/Leisure.html'),
        subzero: resolve(__dirname, 'public/SubZero.html'),
        art: resolve(__dirname, 'public/Art.html'),
      },
      output: {
        assetFileNames: '[name][extname]',
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'main') return '[name].js'
          return '[name]/[name].js'
        }
      }
    }
  }
})
