<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Question, Answer } from '../content.config.ts'
import { answers, currentQuestionIndex } from '../store.ts'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import AnswerButton from './AnswerButton.vue'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['done', 'reset'])

if (currentQuestionIndex.value > props.questions.length) {
  currentQuestionIndex.value = 0
}

const currentQuestionProgress = computed(() => currentQuestionIndex.value + 1)

const currentQuestion = computed(
  (): Question | undefined => props.questions[currentQuestionIndex.value],
)
const questionsCount = computed(() => props.questions.length)

const nextQuestion = () => {
  if (currentQuestionIndex.value < props.questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    emit('done')
  }
}

const saveAnswer = (answer: Answer) => {
  answers.value[currentQuestion.value!.id] = { answer }

  nextQuestion()
}

const skipQuestion = () => {
  if (answers.value[currentQuestion.value!.id]) {
    delete answers.value[currentQuestion.value!.id]
  }
  nextQuestion()
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--
}

const partyAnswerExists = (answer: Answer): boolean =>
  currentQuestion.value!.answers.some((a) => a.answer === answer)

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
        class="bg-blue-200"
        role="progressbar"
        aria-label="Fortschritt"
        aria-valuemin="1"
        :aria-valuemax="questionsCount"
        :aria-valuenow="currentQuestionProgress"
      >
        <div
          class="h-2 bg-blue-900 transition-all duration-300 ease-out"
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
          <h2 class="my-8 text-xl md:text-2xl font-medium">
            {{ currentQuestion.thesis }}
          </h2>
        </div>
      </div>
      <div class="px-4">
        <div class="flex flex-col md:flex-row max-md:space-y-3 md:space-x-2">
          <AnswerButton
            answer="zu weit"
            label="nein, das geht zu weit"
            :party-answer-exists="partyAnswerExists('zu weit')"
            @save="saveAnswer"
            accesskey="1"
          >
            <IconLess />
          </AnswerButton>
          <AnswerButton
            answer="richtig"
            label="ja, das ist richtig"
            :party-answer-exists="partyAnswerExists('richtig')"
            @save="saveAnswer"
            accesskey="2"
          >
            <IconRight class="me-1" />
          </AnswerButton>
          <AnswerButton
            answer="nicht weit genug"
            label="nein, das reicht nicht aus"
            :party-answer-exists="partyAnswerExists('nicht weit genug')"
            @save="saveAnswer"
            accesskey="3"
          >
            <IconMore class="me-1" />
          </AnswerButton>
          <div class="!ms-auto self-center max-md:pt-4">
            <button @click="skipQuestion" class="btn-text">
              These überspringen <IconForward class="ms-1" />
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>

  <div
    class="flex mt-4 text-blue-900"
    v-if="currentQuestion && currentQuestionIndex > 0"
  >
    <button @click="previousQuestion" class="btn-text">
      <IconBack class="me-1" />
      Zurück
    </button>

    <button @click="emit('reset')" class="btn-text ms-auto">
      <IconRestart class="me-1" />
      Neustarten
    </button>
  </div>
</template>
