<script setup lang="ts">
import { nextTick } from 'vue'
import { useStore, Stage } from '../store'

const props = defineProps<{ isApp: boolean }>()

const { currentStage, viewTransition } = useStore()

const toIntro = (e: Event) => {
  if (props.isApp) {
    e.preventDefault()
    viewTransition.value = 'slide-back'
    nextTick(() => {
      currentStage.value = Stage.Intro
    })
  }
}
</script>

<template>
  <header class="z-10 container mx-auto px-4 py-12">
    <a href="/" @click="toIntro">
      <h1 class="mb-1 text-5xl font-bold md:text-8xl">Real-O-Mat</h1>
    </a>
    <span class="text-xl font-medium text-purple-800">
      Bundestagswahl 2025
    </span>
  </header>
</template>
