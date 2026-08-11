<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Election } from '../content.config'
import FdsLogo from '../assets/fragdenstaat_text.svg'
import IconHeart from '~icons/material-symbols/favorite'

const props = defineProps<{ election?: Election }>()

const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement>()

function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuButton.value?.focus()
}

onMounted(() => {
  window.addEventListener('resize', () => {
    menuOpen.value = false
  })
})
</script>

<template>
  <header
    class="z-10 container mx-auto grid grid-cols-[1fr_auto] items-center gap-y-1 px-4 py-8 md:py-12 xl:items-start xl:py-24"
    @keydown.esc="closeMenu"
  >
    <div>
      <a href="/">
        <h1
          class="-mt-2 mb-1 text-4xl font-bold sm:text-7xl lg:text-8xl"
          style="margin-left: -0.07em"
        >
          Real-O-Mat
        </h1>
      </a>
    </div>
    <div
      class="col-start-2 row-start-1 flex flex-row items-center gap-2 md:gap-6 xl:hidden"
    >
      <a
        href="https://fragdenstaat.de/jetzt-spenden/?pk_campaign=realomat"
        target="_blank"
        class="hover:text-purple-80 me-2 font-medium text-purple-600 md:me-4"
      >
        <IconHeart
          aria-hidden="true"
          class="me-1 inline-block text-2xl md:text-base"
        />
        <span class="sr-only">Spenden</span>
        <span class="max-md:hidden" aria-hidden="true">Spenden</span>
      </a>

      <button
        ref="menuButton"
        class="ml-auto flex flex-col gap-2 hover:text-purple-800"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        aria-label="Menü"
        @click="menuOpen = !menuOpen"
      >
        <span
          class="block h-0.5 w-8 bg-current transition"
          :class="{ 'translate-y-2.5 rotate-45': menuOpen }"
        ></span>
        <span
          class="block h-0.5 w-8 bg-current transition"
          :class="{ 'opacity-0': menuOpen }"
        ></span>
        <span
          class="block h-0.5 w-8 bg-current transition"
          :class="{ '-translate-y-2.5 -rotate-45': menuOpen }"
        ></span>
      </button>
    </div>
    <nav
      class="col-span-2 row-start-3 xl:col-span-1 xl:col-start-2 xl:row-start-1"
    >
      <ul
        id="site-nav"
        class="flex-col items-end gap-4 text-lg font-medium xl:flex xl:flex-row xl:items-start xl:justify-end"
        :class="menuOpen ? 'flex' : 'hidden'"
      >
        <li>
          <a href="/faq/" class="hover:text-purple-800">FAQ</a>
        </li>
        <li>
          <a href="/methodik/" class="hover:text-purple-800">Methodik</a>
        </li>
        <li>
          <a href="/about/" class="hover:text-purple-800">Über uns</a>
        </li>
        <li :class="{ 'md:hidden': menuOpen }">
          <a
            href="https://fragdenstaat.de/jetzt-spenden/?pk_campaign=realomat"
            target="_blank"
            class="text-purple-600 hover:text-purple-800"
          >
            <IconHeart aria-hidden="true" class="mr-1 inline-block" />Spenden
          </a>
        </li>
      </ul>
    </nav>
    <div class="col-span-2">
      <span
        class="text-lg font-medium text-purple-800 md:text-xl"
        v-if="props.election"
      >
        {{ props.election.title }}
      </span>
      <div
        class="flex items-start text-lg font-medium text-purple-800 md:text-xl"
        v-else
      >
        <p>Ein Projekt von</p>
        <a href="https://fragdenstaat.de" target="_blank">
          <img
            :src="FdsLogo.src"
            alt="Ein Projekt von FragDenStaat"
            class="ms-2 inline-block w-32"
          />
        </a>
      </div>
    </div>
  </header>
</template>
