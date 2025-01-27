<script setup lang="ts">
import { computed, nextTick, ref, toRaw } from 'vue'
import type { Question, Answer } from '../content.config.ts'
import { useStore } from '../store.ts'
import QuestionCard from '../components/QuestionCard.vue'
import IconBack from '~icons/material-symbols/arrow-back'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['done', 'reset', 'previous'])

const { answers, deleteAnswer, currentQuestionIndex, currentQuestionProgress } =
  useStore()

if (currentQuestionIndex.value > props.questions.length) {
  currentQuestionIndex.value = 0
}

const currentQuestion = computed(
  (): Question | undefined => props.questions[currentQuestionIndex.value],
)
const questionsCount = computed(() => props.questions.length)

const transitionName = ref('slide')

const nextQuestion = () => {
  transitionName.value = 'slide'

  if (currentQuestionIndex.value < props.questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    emit('done')
  }
}

const saveAnswer = (answer: Answer) => {
  const questionId = toRaw(currentQuestion.value!.id)
  nextQuestion()
  answers.value[questionId] = {
    answer,
    questionId,
    weight: 1,
  }
}

const skipQuestion = () => {
  deleteAnswer(currentQuestion.value!.id)
  nextQuestion()
}

const previousQuestion = () => {
  transitionName.value = 'slide-back'

  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  } else {
    emit('previous')
  }
}
</script>

<template>
  <div>
    <article v-if="currentQuestion" class="overflow-hidden">
      <div
        class="bg-white/50"
        role="progressbar"
        aria-label="Fortschritt"
        aria-valuemin="1"
        :aria-valuemax="questionsCount"
        :aria-valuenow="currentQuestionProgress"
      >
        <div
          class="h-2 bg-purple-900 duration-300 ease-out motion-safe:transition-all"
          :style="{
            width: `${(currentQuestionProgress / questionsCount) * 100}%`,
          }"
        />
      </div>

      <QuestionCard
        :currentQuestionIndex="currentQuestionIndex"
        :currentQuestionProgress="currentQuestionProgress"
        :questionsCount="questionsCount"
        :currentQuestion="currentQuestion"
        :transitionName="transitionName"
        @saveAnswer="saveAnswer"
        @skipQuestion="skipQuestion"
      />
    </article>

    <div class="mt-4 flex">
      <button @click="previousQuestion" class="btn-text">
        <IconBack aria-hidden="true" class="me-1" />
        Zurück
      </button>
      <button
        @click="emit('reset')"
        class="btn-text ms-auto"
        v-if="currentQuestionIndex > 0"
      >
        <IconRestart aria-hidden="true" class="me-1" />
        Neustarten
      </button>
    </div>
  </div>
</template>
