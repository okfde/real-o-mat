<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '../content.config'
import IconForward from '~icons/material-symbols/arrow-forward'
import { useStore } from '../store'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['done', 'previous'])

const { answers, answerCount } = useStore()

const sortedAnswers = computed(() => {
  return Object.values(answers.value)
    .map((answer) => ({
      ...answer,
      question: props.questions.find((q) => q.id === answer.questionId)!,
    }))
    .sort((a, b) => a.question.index - b.question.index)
})

const setWeight = (questionId: string, e: Event) => {
  answers.value[questionId].weight = (e.target as HTMLInputElement).checked
    ? 2
    : 1
}
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
  <form @submit.prevent="emit('done')" v-else>
    <div class="p-4 bg-white mb-4">
      <h2 class="text-xl mb-4">Welche Themen sind Ihnen besonders wichtig?</h2>
      <p>
        Markieren Sie die Themen, um diese mit doppelter Gewichtung in die
        Berechnung einfließen zu lassen.
      </p>
    </div>

    <div class="grid md:grid-cols-1 gap-4">
      <label
        v-for="({ answer, questionId, question }, i) in sortedAnswers"
        :key="questionId"
        class="flex items-start space-x-2 bg-white p-4"
      >
        <div>
          <input
            type="checkbox"
            :id="`category-${i}`"
            @change="(e) => setWeight(questionId, e)"
            :aria-labelledby="`category-${i}`"
          />
        </div>

        <div>
          <div class="inline">
            <h3 class="font-medium text-lg" :id="`category-${i}`">
              {{ i + 1 }}. {{ question.category }}
            </h3>
            <p>{{ question.thesis }}</p>
          </div>
        </div>
      </label>
    </div>

    <button type="submit" class="btn mt-4">
      Weiter <IconForward class="ms-1" />
    </button>

    <hr class="border-gray-200 mt-6" />
  </form>
</template>

<style scoped>
/* create a checkbox that is a circle, and when checked displays "2x" within it */
input[type='checkbox'] {
  appearance: none;

  @apply appearance-none relative w-8 h-8 border border-gray-500 rounded-full motion-safe:transition-all motion-safe:duration-300 focus:ring focus:ring-blue-600/75 outline-none;
}

input[type='checkbox']::before {
  content: 'x2';
  @apply flex motion-safe:transition motion-safe:duration-200 absolute inset-0 rounded-full items-center justify-center text-gray-500 opacity-0;
}

input[type='checkbox']:checked::before,
input[type='checkbox']:hover::before,
input[type='checkbox']:focus::before {
  @apply opacity-100;
}

input[type='checkbox']:checked {
  @apply border-transparent;
}

input[type='checkbox']::before:checked {
  @apply text-white bg-gray-600;
}
</style>
