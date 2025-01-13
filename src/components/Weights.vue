<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Question } from '../content.config'
import IconForward from '~icons/material-symbols/arrow-forward'
import { weightedTopics } from '../store'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['done'])

const categories = computed(() => {
  return Object.groupBy(props.questions, (q) => q.category)
})
</script>

<template>
  <form class="p-4 bg-white" @submit.prevent="emit('done')">
    <h2 class="text-xl mb-4">Welche Themen sind Ihnen besonders wichtig?</h2>
    <p class="mb-4">
      Markieren Sie die Themen, um diese mit doppelter Gewichtung in die
      Berechnung einfließen zu lassen.
    </p>

    <div class="grid gap-2 md:grid-cols-3">
      <div
        v-for="(questions, categoryName, i) in categories"
        :key="categoryName"
        class="flex items-start space-x-2"
      >
        <input
          type="checkbox"
          :id="`category-${i}`"
          v-model="weightedTopics"
          :value="categoryName"
        />

        <label
          :for="`category-${i}`"
          class="inline font-medium text-lg hyphens-auto"
        >
          {{ categoryName }}
        </label>
      </div>
    </div>

    <button type="submit" class="btn mt-4">
      Weiter <IconForward class="ms-1" />
    </button>
  </form>
</template>

<style scoped>
/* create a checkbox that is a circle, and when checked displays "2x" within it */
input[type='checkbox'] {
  appearance: none;

  @apply appearance-none relative w-8 h-8 border-2 border-gray-500 rounded-full motion-safe:transition-all motion-safe:duration-300 focus:ring focus:ring-blue-600 focus:border-blue-600 outline-transparent;
}

input[type='checkbox']::before {
  content: '';
  @apply flex motion-safe:transition-opacity motion-safe:duration-150 opacity-0 absolute inset-0 text-lg rounded-full items-center justify-center text-white bg-gray-800;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTAgMTdIN3EtLjgyNSAwLTEuNDEyLS41ODdUNSAxNXYtMnEwLS44MjUuNTg4LTEuNDEyVDcgMTFoMlY5SDZxLS40MjUgMC0uNzEyLS4yODhUNSA4dC4yODgtLjcxMlQ2IDdoM3EuODI1IDAgMS40MTMuNTg4VDExIDl2MnEwIC44MjUtLjU4NyAxLjQxM1Q5IDEzSDd2MmgzcS40MjUgMCAuNzEzLjI4OFQxMSAxNnQtLjI4OC43MTNUMTAgMTdtNi0zLjMyNWwtMS43NSAyLjlxLS4xMjUuMi0uMzEyLjMxM3QtLjQxMy4xMTJxLS41IDAtLjc2My0uNDM3dC4wMTMtLjg2M0wxNSAxMmwtMi4yMjUtMy43cS0uMjc1LS40MjUtLjAxMi0uODYyVDEzLjUyNSA3cS4yMjUgMCAuNDEzLjExM3QuMzEyLjMxMmwxLjc1IDIuOWwxLjc1LTIuOXEuMTI1LS4yLjMxMy0uMzEyVDE4LjQ3NSA3cS41IDAgLjc2My40Mzh0LS4wMTMuODYyTDE3IDEybDIuMjI1IDMuN3EuMjc1LjQyNS4wMTMuODYzdC0uNzYzLjQzN3EtLjIyNSAwLS40MTMtLjExMnQtLjMxMi0uMzEzeiIvPjwvc3ZnPg==');
  background-size: 100%;
}

input[type='checkbox']::before:checked {
  @apply opacity-100;
}
</style>
