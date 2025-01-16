<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Question } from '../content.config'
import IconForward from '~icons/material-symbols/arrow-forward'
import { useStore } from '../store'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['done', 'previous'])

const { answerCount, weightedTopics } = useStore()

const categories = computed(() => {
  return Object.groupBy(props.questions, (q) => q.category)
})
</script>

<template>
  <div class="p-4 bg-white" v-if="answerCount < 5">
    <h2 class="text-4xl font-medium">
      Sie haben leider zu wenig Fragen beantwortet.
    </h2>
    <p class="mt-4">
      Beantworten Sie mindestens fünf Fragen, um Ihr Ergebnis zu sehen.
    </p>
    <button @click="emit('previous')" class="btn mt-4">
      Zurück zu den Fragen
    </button>
  </div>
  <form class="p-4 bg-white" @submit.prevent="emit('done')" v-else>
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
  content: 'x2';
  @apply flex motion-safe:transition motion-safe:duration-150 absolute inset-0 rounded-full items-center justify-center text-gray-500 opacity-0;
  background-size: 100%;
}

input[type='checkbox']:checked::before,
input[type='checkbox']:hover::before,
input[type='checkbox']:focus::before {
  @apply opacity-100;
}

input[type='checkbox']::before:checked {
  @apply text-white bg-gray-800;
}
</style>
