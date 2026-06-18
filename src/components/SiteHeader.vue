<script setup lang="ts">
import { nextTick } from 'vue'
import { useStore, Stage } from '../store'
import type { Election } from '../content.config';

const props = defineProps<{ election?: Election }>()

</script>

<template>
  <header class="z-10 container mx-auto px-4 py-12">
    <a href="/">
      <h1 class="mb-1 text-5xl font-bold md:text-8xl">Real-O-Mat</h1>
    </a>
    <span class="text-xl font-medium text-purple-800">
      {{ props.election? props.election.title : "Ein Tool von FragDenStaat" }}
    </span>
  </header>
</template>
