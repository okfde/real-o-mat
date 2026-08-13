<script setup lang="ts">
import { computed } from 'vue'
import type { Election } from '../content.config'
import IconForward from '~icons/material-symbols/arrow-forward'
import { useStore } from '../store'

const props = defineProps<{
  election: Election
}>()

const emit = defineEmits(['done', 'previous'])

const { answers, answerCount } = useStore(props.election.slug)

const sortedAnswers = computed(() => {
  return Object.values(answers.value)
    .map((answer) => ({
      ...answer,
      question: props.election.questions.find(
        (q) => q.id === answer.questionId,
      )!,
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
  <div class="bg-white p-4" v-if="answerCount < 5">
    <h2>Du hast leider zu wenig Fragen beantwortet.</h2>
    <p class="mt-4">
      Beantworte mindestens fünf Fragen, um Dein Ergebnis zu sehen.
    </p>
    <button @click="emit('previous')" class="btn mt-4">
      Zurück zu den Fragen
    </button>
  </div>
  <form @submit.prevent="emit('done')" v-else>
    <div class="mb-4 bg-white p-4 md:p-8">
      <h2>Welche Thesen sind Dir besonders wichtig?</h2>
      <p>
        Markiere die Thesen, um diese mit doppelter Gewichtung in die Berechnung
        einfließen zu lassen.
      </p>
      <button type="submit" class="btn mt-4">
        Weiter
        <IconForward aria-hidden="true" class="ms-1" />
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-1">
      <label
        v-for="{ answer, weight, questionId, question } in sortedAnswers"
        :key="questionId"
        class="flex space-x-3 bg-white p-4 md:items-center md:space-x-4"
      >
        <div class="max-md:pt-1">
          <input
            type="checkbox"
            :checked="weight === 2"
            @change="(e) => setWeight(questionId, e)"
            :aria-labelledby="`label-${questionId}`"
          />
        </div>

        <div>
          <div class="inline">
            <h3 class="text-lg font-medium" :id="`label-${questionId}`">
              {{ question.index + 1 }}. {{ question.category }}
            </h3>
            <p>{{ question.thesis }}</p>
          </div>
        </div>
      </label>
    </div>

    <div class="mt-4 bg-white p-4">
      <button type="submit" class="btn">
        Weiter
        <IconForward aria-hidden="true" class="ms-1" />
      </button>
    </div>
  </form>
</template>

<style scoped>
@reference "../assets/style.css";

label {
  @apply cursor-pointer;
}

input[type='checkbox'] {
  appearance: none;

  @apply relative h-8 w-8 appearance-none rounded-full border border-solid border-gray-500 outline-none focus:ring-purple-600/75 motion-safe:transition-all motion-safe:duration-300;
}

input[type='checkbox']::before {
  content: 'x2';
  @apply absolute inset-0 flex items-center justify-center rounded-full text-gray-500 opacity-0 motion-safe:transition motion-safe:duration-200;
}

input[type='checkbox']:checked::before,
input[type='checkbox']:hover::before,
input[type='checkbox']:focus::before {
  @apply opacity-100;
}

input[type='checkbox']:checked {
  @apply border-transparent;
}

input[type='checkbox']:checked::before {
  @apply bg-gray-600 text-white;
}
</style>
