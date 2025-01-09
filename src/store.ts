import { useStorage } from '@vueuse/core'
import type { Answer, Party } from './content.config.ts'

type UserPosition = {
  answer: Answer
}

export const answers = useStorage(
  'realomat-answers',
  {} as Record<string, UserPosition>,
)

export const weightedTopics = useStorage('realomat-weights', [] as string[])

export const currentQuestionIndex = useStorage('realomat-current-question', 0)

export enum Stage {
  Intro,
  Questionnaire,
  Weights,
  Results,
}

export const currentStage = useStorage<Stage>('realomat-stage', Stage.Intro)

export const partyNames: Record<Party, string> = {
  spd: 'SPD',
  cdu: 'CDU',
  fdp: 'FDP',
  gruene: 'Die Grünen',
  bsw: 'BSW',
  linke: 'Die Linke',
  afd: 'AFD',
}
