<script setup lang="ts">

import FdsLogo from '../assets/fragdenstaat.svg'
import IconForward from '~icons/material-symbols/arrow-forward'

// import { computed, onMounted, useTemplateRef, nextTick } from 'vue'
// import { answerOptions, useStore } from '../store.ts'
// import type { Answer, Election, Question } from '../content.config.ts'
// import AnswerIndicator from './AnswerIndicator.vue'
// import AnswerButton from './AnswerButton.vue'
// import IconForward from '~icons/material-symbols/arrow-forward'
// import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
// import IconMore from '~icons/material-symbols/stat-2-rounded'
// import IconRight from '~icons/material-symbols/check-rounded'
// import IconEdit from '~icons/material-symbols/edit-rounded'

// const props = defineProps<{
//   election: Election
//   questionsCount: number
//   currentQuestionIndex: number
//   currentQuestionProgress: number
//   currentQuestion: Question
//   transitionName?: string
//   compact?: boolean
// }>()

// defineEmits<{
//   (e: 'saveAnswer', answer: Answer): void
//   (e: 'skipQuestion'): void
//   (e: 'nextQuestion'): void
// }>()

// const { answers, deleteAnswer } = useStore(props.election.slug)

// const buttonContainer = useTemplateRef<HTMLDivElement>('button-container')

// const answerButtons = computed(() => {
//   const buttons: Record<string, any> = {
//     'zu weit': { icon: IconLess },
//     richtig: { icon: IconRight },
//     'nicht weit genug': { icon: IconMore },
//   }

//   for (const button in buttons) {
//     buttons[button].disabled = !props.currentQuestion.answers.some(
//       (a) => a.answer === button,
//     )
//   }

//   return buttons as Record<Answer, any>
// })

// const hasAnswer = computed(
//   () => answers.value[props.currentQuestion.id] !== undefined,
// )

// const focusFirstButton = () => {
//   buttonContainer.value?.querySelector?.('button')?.focus()
// }

// const editAnswer = () => {
//   deleteAnswer(props.currentQuestion.id)
//   nextTick(focusFirstButton)
// }

// onMounted(focusFirstButton)
</script>

<template>
  <div
    class="w-full md:w-1/2 md:-rotate-2 md:-mt-6 flex flex-col justify-between align-right bg-yellow-200 mt-6 p-4 md:p-8 md:mr-16 ml-auto shadow-lg">
    <span class="text-xl font-semibold mb-3">Mehr von FragDenStaat</span>
    <p class="mb-5">
      FragDenStaat macht nicht nur den Real-O-Mat, sondern auch investigative Recherchen, Klagen und Community-Aktionen.
      Du möchtest mehr über das Informationsfreiheitsgesetz erfahren? Lies jetzt weiter auf <a
        href="https://fragdenstaat.de/artikel/klagen/2025/10/entwurf-transparenzgesetz-klage/">FragDenStaat.de</a>!
    </p>
    <div class="flex flex-row justify-end text-right items-center">
      <a href="https://fragdenstaat.de" target="_blank">
        Jetzt den
        <img :src="FdsLogo.src" alt="Ein Projekt von FragDenStaat" class="ms-2 -mt-3 inline-block w-32" />
        Newsletter abonnieren!
      </a>
      <IconForward aria-hidden="true" class="ms-1 shrink-0 max-md:ms-4" />
    </div>
  </div>
</template>
