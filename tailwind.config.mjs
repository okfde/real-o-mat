/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat Variable'],
      },
      colors: {
        primary: {
          purple: '#B68EF8',
          red: '#EC4F46',
          orange: '#FEBD59',
          green: '#7ED956',
          yellow: '#fae357',
          cyan: '#b6eef2',
        },
      },
    },
  },
  plugins: [],
}
