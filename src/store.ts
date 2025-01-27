import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { Answer, Party } from './content.config.ts'

export type UserPosition = {
  answer: Answer
  weight: number
  questionId: string
}

export const answerLabels: Record<Answer, string> = {
  'zu weit': 'nein, geht mir zu weit',
  richtig: 'ja, finde ich auch',
  'nicht weit genug': 'nein, reicht mir nicht aus',
  '/': 'Position nicht wertbar',
}

export enum Stage {
  Intro,
  Tutorial,
  Questionnaire,
  Weights,
  Results,
}

export const partyNames: Record<Party, string> = {
  spd: 'SPD',
  cdu: 'CDU',
  fdp: 'FDP',
  gruene: 'Die Grünen',
  bsw: 'BSW',
  linke: 'Die Linke',
  afd: 'AFD',
}

export const parties = Object.keys(partyNames) as Party[]

export function useStore() {
  const answers = useStorage(
    'realomat-answers',
    {} as Record<string, UserPosition>,
  )

  const answerCount = computed(() => Object.values(answers.value).length)
  const deleteAnswer = (questionId: string) => {
    if (answers.value[questionId]) delete answers.value[questionId]
  }

  const currentQuestionIndex = useStorage('realomat-current-question', 0)
  const currentQuestionProgress = computed(() => currentQuestionIndex.value + 1)

  const currentStage = useStorage<Stage>('realomat-stage', Stage.Intro)

  const viewTransition = ref('slide' as 'slide' | 'slide-back')

  return {
    answers,
    deleteAnswer,
    answerCount,
    currentQuestionIndex,
    currentQuestionProgress,
    currentStage,
    viewTransition,
  }
}
