<script setup lang="ts">
import { ref } from 'vue'
import type { Election } from '../content.config';
import FdsLogo from '../assets/fragdenstaat_banner_mono.svg'
import IconHeart from '~icons/material-symbols/favorite'

const props = defineProps<{ election?: Election }>()

const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement>()

function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuButton.value?.focus()
}

</script>

<template>
  <header
    class="z-10 container mx-auto px-4 py-8 md:py-12 grid grid-cols-[1fr_auto] items-start gap-y-1"
    @keydown.esc="closeMenu"
  >
    <div>
    <a href="/">
      <h1 class="mb-1 -mt-2 text-5xl lg:text-8xl font-bold">Real-O-Mat</h1>
    </a>
    <span class="text-xl font-medium text-purple-800" v-if="props.election">
      {{ props.election.title }}
    </span>
    <div class="text-xl font-medium text-purple-800 flex items-end mt-2" v-else>
      <p aria-hidden="true">Ein Projekt von</p>
      <a href="https://fragdenstaat.de" target="_blank">
        <img :src="FdsLogo.src" alt="Ein Projekt von FragDenStaat" class="ms-4 mb-1 inline-block w-32" />
      </a>
    </div>

    </div>
    <div class="col-start-2 row-start-1 flex flex-row xl:hidden gap-6" >

      <a href="https://fragdenstaat.de/spenden/" target="_blank" class="text-purple-600 hover:text-white bg-transparent hover:bg-purple-600 font-medium text-lg px-2 md:px-4 py-2 -mt-2.5 hover:border-transparent rounded">
        <IconHeart aria-hidden="true" class="inline-block md:mr-2 text-2xl md:text-base" />
        <span class="sr-only">Spenden</span>
        <span class="hidden md:inline" aria-hidden="true">Spenden</span></a>

      <button
      ref="menuButton"
      class="ml-auto flex flex-col gap-2 hover:text-purple-800"
      :aria-expanded="menuOpen"
      aria-controls="site-nav"
      aria-label="Menü"
      @click="menuOpen = !menuOpen"
      >
      <span class="block h-0.5 w-8 bg-current transition" :class="{ 'translate-y-2.5 rotate-45': menuOpen }"></span>
      <span class="block h-0.5 w-8 bg-current transition" :class="{ 'opacity-0': menuOpen }"></span>
      <span class="block h-0.5 w-8 bg-current transition" :class="{ '-translate-y-2.5 -rotate-45': menuOpen }"></span>
      </button>

    </div>
    <nav class="col-span-2 xl:col-span-1 xl:col-start-2 xl:row-start-1">
      <ul
        id="site-nav"
        class="flex-col items-end xl:flex xl:flex-row xl:items-start xl:justify-end gap-4 text-lg font-medium"
        :class="menuOpen ? 'flex' : 'hidden'"
      >
        <li>
          <a href="/faq/" class="hover:text-purple-800">FAQ</a>
        </li>
        <li>
          <a href="/methodik/" class="hover:text-purple-800">Methodik</a>
        </li>
        <li>
          <a href="#" class="hover:text-purple-800">Über uns</a>
        </li>
        <li>
          <a href="https://fragdenstaat.de/spenden/" target="_blank" class="text-purple-600 hover:text-purple-800">
            <IconHeart aria-hidden="true" class="inline-block mr-1" />Spenden</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
