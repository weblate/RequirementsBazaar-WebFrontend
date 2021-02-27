import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import viteComponents from 'vite-plugin-components';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'masonry-layout'
        }
      }
    })
  ]
})
