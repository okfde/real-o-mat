// @ts-check
import { defineConfig } from 'astro/config'

import vue from '@astrojs/vue'
import Icons from 'unplugin-icons/vite'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [vue()],
  vite: {
    plugins: [
      // tailwindcss(),
      Icons({
        compiler: 'vue3',
      }),
    ],
  },
})
