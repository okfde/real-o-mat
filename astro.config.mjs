// @ts-check
import { defineConfig, envField } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vue from '@astrojs/vue'
import Icons from 'unplugin-icons/vite'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind(), vue()],
  vite: {
    plugins: [
      Icons({
        compiler: 'vue3',
      }),
    ],
  },
  env: {
    schema: {
      GOOGLE_SPREADSHEET_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      GOOGLE_SPREADSHEET_RANGE: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
})
