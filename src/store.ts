import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import type { Answer, Party } from './content.config.ts'

type UserPosition = {
  answer: Answer
}

export const answerLabels: Record<Answer, string> = {
  'zu weit': 'nein, geht mir zu weit',
  richtig: 'ja, finde ich auch',
  'nicht weit genug': 'nein, reicht mir nicht aus',
  '/': 'keine Antwort vorhanden',
  '-': 'neutral',
}

export enum Stage {
  Intro,
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

  const weightedTopics = useStorage('realomat-weights', [] as string[])

  const currentQuestionIndex = useStorage('realomat-current-question', 0)

  const currentStage = useStorage<Stage>('realomat-stage', Stage.Intro)

  return {
    answers,
    answerCount,
    weightedTopics,
    currentQuestionIndex,
    currentStage,
  }
}
