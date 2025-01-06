<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Question, Answer } from '../content.config.ts'
import { useStorage } from '@vueuse/core'
import IconBack from '~icons/material-symbols/arrow-back'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'

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

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--
}

const reset = () => {
  answers.value = {}
  currentQuestionIndex.value = 0
}

const confirmReset = () => {
  if (window.confirm('Wirklich von vorne beginnen?')) {
    reset()
  }
}

const beforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = '' // legacy browsers
}

watch(currentQuestion, () => {
  if (currentQuestion.value && currentQuestionIndex.value !== 0) {
    window.addEventListener('beforeunload', beforeUnload)
  } else {
    window.removeEventListener('beforeunload', beforeUnload)
  }
})
</script>

<template>
  <div class="pb-4 bg-white">
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
      <div class="min-h-72 md:min-h-42">
        <div class="px-4 mt-4 text-gray-600 flex">
          <span> {{ currentQuestion.category }} </span>
          <div class="max-md:hidden ms-auto text-nowrap" aria-hidden="true">
            Frage {{ currentQuestionProgress }} / {{ questionsCount }}
          </div>
        </div>
        <div class="px-4">
          <h2 class="my-8 text-xl md:text-2xl font-semibold">
            {{ currentQuestion.thesis }}
          </h2>
        </div>
      </div>
      <div class="px-4">
        <div class="flex flex-col md:flex-row max-md:space-y-3 md:space-x-2">
          <button class="btn" @click="saveAnswer('zu weit')" accesskey="1">
            geht zu weit
          </button>
          <button class="btn" @click="saveAnswer('richtig')" accesskey="2">
            genau richtig
          </button>
          <button
            class="btn"
            @click="saveAnswer('nicht weit genug')"
            accesskey="3"
          >
            geht nicht weit genug
          </button>
          <div class="!ms-auto self-center max-md:pt-4">
            <button @click="currentQuestionIndex++">These überspringen</button>
          </div>
        </div>
      </div>
    </article>

    <div v-else class="px-4 pt-4">
      <h2 class="text-4xl font-semibold">Fertig</h2>
      <div class="my-4">
        Deine Antworten:
        <pre>{{ answers }}</pre>
      </div>

      <button @click="reset" class="btn">Neustart</button>
    </div>
  </div>

  <div class="flex mt-4" v-if="currentQuestion && currentQuestionIndex > 0">
    <button @click="previousQuestion" class="flex items-center">
      <IconBack class="me-1" />
      Zurück
    </button>

    <button @click="confirmReset" class="flex items-center ms-auto">
      <IconRestart class="me-1" />
      Neustarten
    </button>
  </div>
</template>
