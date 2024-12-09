<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Question, Answer } from '../content.config.ts'
import { useStorage } from '@vueuse/core'

const props = defineProps<{
  questions: Question[]
}>()

const answers = useStorage('realomat-answers', {} as Record<string, Answer>)

const currentQuestionIndex = useStorage('realomat-current-question', 0)
if (currentQuestionIndex.value > props.questions.length) {
  currentQuestionIndex.value = 0
}

const currentQuestionProgress = computed(() => currentQuestionIndex.value + 1)

const currentQuestion = computed(
  (): Question | undefined => props.questions[currentQuestionIndex.value],
)
const questionsCount = computed(() => props.questions.length)

const saveAnswer = (answer: Answer) => {
  answers.value[currentQuestion.value!.id] = answer
  currentQuestionIndex.value++
}

const reset = () => {
  answers.value = {}
  currentQuestionIndex.value = 0
}
</script>

<template>
  <div class="pb-4">
    <article v-if="currentQuestion">
      <div
        role="progressbar"
        aria-label="Fortschritt"
        aria-valuemin="1"
        :aria-valuemax="questionsCount"
        :aria-valuenow="currentQuestionProgress"
      >
        <div
          class="h-2 bg-blue-900"
          :style="{
            width: `${(currentQuestionProgress / questionsCount) * 100}%`,
          }"
        />
      </div>
      <div class="px-4 mt-2 text-gray-600 flex">
        <span> {{ currentQuestion.category }} </span>
        <span class="ms-auto" aria-hidden="true">
          Frage {{ currentQuestionProgress }} / {{ questionsCount }}
        </span>
      </div>
      <div class="px-4">
        <h2 class="my-8 text-4xl font-semibold">
          {{ currentQuestion.question }}
        </h2>
        <div class="flex space-x-2">
          <button class="btn" @click="saveAnswer('yes')">stimme zu</button>
          <button class="btn" @click="saveAnswer('neutral')">neutral</button>
          <button class="btn" @click="saveAnswer('no')">stimme nicht zu</button>
          <button class="!ms-auto" @click="currentQuestionIndex++">
            These überspringen
          </button>
        </div>
      </div>
    </article>
    
    <div v-else class="px-4 pt-4">
      <h2 class="text-4xl font-semibold">Fertig</h2>
      <p class="my-4">
        Deine Antworten:
        <pre>{{ answers }}</pre>
      </p>

      <button @click="reset" class="btn">
        Neustart
      </button>
    </div>
  </div>
</template>
