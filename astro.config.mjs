// @ts-check
import { defineConfig, envField } from 'astro/config'

import vue from '@astrojs/vue'
import Icons from 'unplugin-icons/vite'

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [vue()],
  vite: {
    plugins: [// tailwindcss(),
    Icons({
      compiler: 'vue3',
    }), tailwindcss()],
  },
  env: {
    schema: {
      TESTING: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
})