<script setup lang="ts">
import { computed } from 'vue'
import { answerLabels, useStore } from '../store'
import type { Answer, Question } from '../content.config'
import AnswerIndicator from './AnswerIndicator.vue'
import AnswerButton from './AnswerButton.vue'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import IconEdit from '~icons/material-symbols/edit-rounded'

const props = defineProps<{
  questionsCount: number
  currentQuestionIndex: number
  currentQuestionProgress: number
  currentQuestion: Question
  transitionName?: string
  compact?: boolean
}>()

defineEmits<{
  (e: 'saveAnswer', answer: Answer): void
  (e: 'skipQuestion'): void
  (e: 'nextQuestion'): void
}>()

const { answers, deleteAnswer } = useStore()

const answerButtons = computed(() => {
  const buttons: Record<string, any> = {
    'zu weit': { icon: IconLess },
    richtig: { icon: IconRight },
    'nicht weit genug': { icon: IconMore },
  }

  for (const button in buttons) {
    buttons[button].disabled = !props.currentQuestion.answers.some(
      (a) => a.answer === button,
    )
  }

  return buttons as Record<Answer, any>
})

const hasAnswer = computed(
  () => answers.value[props.currentQuestion.id] !== undefined,
)
</script>

<template>
  <div class="@container bg-white p-4 md:p-8">
    <div :class="compact ? 'mb-6' : 'min-h-72'">
      <Transition
        class="duration-250 ease-linear motion-safe:transition-opacity"
        enter-from-class="motion-safe:opacity-0"
        leave-to-class="motion-safe:opacity-0"
        mode="out-in"
      >
        <div
          class="flex text-gray-700 @md:mt-4 @md:text-2xl"
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
        <div aria-live="assertive" class="" :key="currentQuestionIndex">
          <h2 class="my-4 text-xl font-medium max-md:hyphens-auto @md:text-4xl">
            {{ currentQuestion.thesis }}
          </h2>
        </div>
      </Transition>
    </div>
    <Transition :name="transitionName" mode="out-in">
      <div :key="currentQuestionIndex">
        <div v-if="hasAnswer" class="flex flex-wrap items-center gap-4">
          Ihre Auswahl:
          <AnswerIndicator :answer="answers[currentQuestion.id].answer" />
          {{ answerLabels[answers[currentQuestion.id].answer] }}

          <button class="btn-text" @click="deleteAnswer(currentQuestion.id)">
            <IconEdit aria-hidden="true" class="me-1" />
            Ändern
          </button>

          <div class="ms-auto self-center">
            <button @click="$emit('nextQuestion')" class="btn-outline">
              Weiter
              <IconForward aria-hidden="true" class="ms-1" />
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-x-2 gap-y-3" v-else>
          <AnswerButton
            :answer="answer"
            :selected="answers[currentQuestion.id]?.answer === answer"
            @save="$emit('saveAnswer', answer)"
            :disabled="disabled"
            v-for="({ disabled, icon }, answer, i) in answerButtons"
            :key="i"
          >
            <component :is="icon" />
          </AnswerButton>
          <div class="!ms-auto self-center @max-md:pt-4">
            <button @click="$emit('skipQuestion')" class="btn-outline">
              These überspringen
              <IconForward aria-hidden="true" class="ms-1" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
