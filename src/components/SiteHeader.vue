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
  <header class="container mx-auto py-12 px-4 z-10">
    <a href="/" @click="toIntro">
      <h1 class="text-5xl md:text-8xl font-bold mb-1">Real-O-Mat</h1>
    </a>
    <span class="text-xl font-medium text-purple-800">
      Bundestagswahl 2025
    </span>
  </header>
</template>
