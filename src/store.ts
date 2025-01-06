import { useStorage } from '@vueuse/core'
import type { Answer } from './content.config.ts'

type UserPosition = {
  answer: Answer
  weight: number
}

export const answers = useStorage(
  'realomat-answers',
  {} as Record<string, UserPosition>,
)

export const currentQuestionIndex = useStorage('realomat-current-question', 0)

type Stage = 'intro' | 'questionnaire' | 'weights' | 'results'
export const stage = useStorage<Stage>('realomat-stage', 'intro')
