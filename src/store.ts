import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { Answer, Party } from './content.config.ts'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import IconUnknown from './components/IconUnknown.vue'

export type UserPosition = {
  answer: Answer
  weight: number
  questionId: string
}

export const answerOptions = {
  'zu weit': {
    label: 'nein, geht mir zu weit',
    icon: IconLess,
    class: 'bg-primary-red',
  },
  richtig: {
    label: 'ja, finde ich auch',
    icon: IconRight,
    class: 'bg-primary-green',
  },
  'nicht weit genug': {
    label: 'nein, reicht mir nicht aus',
    icon: IconMore,
    class: 'bg-primary-orange',
  },
  '/': {
    label: 'Position nicht wertbar',
    icon: IconUnknown,
    class: 'bg-gray-600',
  },
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
  cdu: 'CDU/CSU',
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
