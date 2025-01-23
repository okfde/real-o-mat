<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { Question, Answer } from '../content.config.ts'
import { useStore } from '../store.ts'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import AnswerButton from '../components/AnswerButton.vue'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits(['done', 'reset', 'previous'])

const { answers, answerCount, currentQuestionIndex } = useStore()

if (currentQuestionIndex.value > props.questions.length) {
  currentQuestionIndex.value = 0
}

const currentQuestionProgress = computed(() => currentQuestionIndex.value + 1)

const currentQuestion = computed(
  (): Question | undefined => props.questions[currentQuestionIndex.value],
)
const questionsCount = computed(() => props.questions.length)

const answerButtons = computed(() => {
  const buttons: Record<string, any> = {
    'zu weit': { icon: IconLess },
    richtig: { icon: IconRight },
    'nicht weit genug': { icon: IconMore },
  }

  for (const button in buttons) {
    buttons[button].disabled = !currentQuestion.value!.answers.some(
      (a) => a.answer === button,
    )
  }

  return buttons
})

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
  answers.value[currentQuestion.value!.id] = {
    answer,
    questionId: currentQuestion.value!.id,
    weight: 1,
  }

  nextTick().then(() => nextQuestion())
}

const skipQuestion = () => {
  if (answers.value[currentQuestion.value!.id]) {
    delete answers.value[currentQuestion.value!.id]
  }
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
          class="h-2 bg-purple-900 motion-safe:transition-all duration-300 ease-out"
          :style="{
            width: `${(currentQuestionProgress / questionsCount) * 100}%`,
          }"
        />
      </div>

      <div class="p-4 md:p-8 bg-white">
        <div class="min-h-72 md:min-h-42">
          <Transition
            class="motion-safe:transition-opacity duration-250 ease-linear"
            enter-from-class="motion-safe:opacity-0"
            leave-to-class="motion-safe:opacity-0"
            mode="out-in"
          >
            <div
              class="md:mt-4 text-gray-700 text-2xl flex"
              :key="currentQuestionIndex"
            >
              <span>
                <span aria-hidden="false">
                  {{ currentQuestionProgress }} / {{ questionsCount }}
                </span>
                {{ currentQuestion.category }}
              </span>
            </div>
          </Transition>
          <Transition mode="out-in" :name="transitionName">
            <div class="" :key="currentQuestionIndex">
              <h2 class="my-4 text-xl font-medium md:text-4xl">
                {{ currentQuestion.thesis }}
              </h2>
            </div>
          </Transition>
        </div>
        <Transition :name="transitionName" mode="out-in">
          <div
            class="flex flex-col md:flex-row max-md:space-y-3 md:space-x-2"
            :key="currentQuestionIndex"
          >
            <AnswerButton
              :answer="answer as Answer"
              @save="saveAnswer"
              :disabled="disabled"
              v-for="({ disabled, icon }, answer, i) in answerButtons"
            >
              <component :is="icon" />
            </AnswerButton>
            <div class="!ms-auto self-center max-md:pt-4">
              <button @click="skipQuestion" class="btn-outline">
                These überspringen
                <IconForward aria-hidden="true" class="ms-1" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </article>

    <div class="flex mt-4">
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
