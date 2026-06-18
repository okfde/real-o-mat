// @ts-check
import { defineConfig, envField } from 'astro/config'

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
  env: {
    schema: {
      NOCODB_URL: envField.string({ context: 'server', access: 'secret' }),
      NOCODB_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    },
  },
})
