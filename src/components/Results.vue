<script lang="ts" setup>
import type { Question } from '../content.config'
import { answers } from '../store'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['reset'])
</script>

<template>
  <div class="px-4 pt-4">
    <h2 class="text-4xl font-semibold">Fertig</h2>
    <div class="my-4">
      Deine Antworten:
      <pre>{{ answers }}</pre>
    </div>

    <button @click="emit('reset')" class="btn">Neustart</button>
  </div>
</template>
