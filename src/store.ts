import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { Answer, Party, Question } from './content.config.ts'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import IconUnknown from './components/IconUnknown.vue'

export type UserPosition = {
  answer: Answer
  weight: number
  questionId: string
}

const sample = <T>(items: T[]): T | undefined =>
  items[Math.floor(Math.random() * items.length)]

export const answerOptions = {
  'zu weit': {
    label: 'Nein, geht mir zu weit',
    icon: IconLess,
    class: 'bg-primary-red',
  },
  richtig: {
    label: 'Ja, finde ich auch',
    icon: IconRight,
    class: 'bg-primary-green',
  },
  'nicht weit genug': {
    label: 'Nein, reicht mir nicht aus',
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
  Tutorial,
  Questionnaire,
  Weights,
  Results,
}

export const partyMap = (parties: Party[]) =>
  new Map(parties.map((party) => [party.slug, party]))

export function useStore(slug: string) {
  const answers = useStorage(
    'realomat-answers-' + slug,
    {} as Record<string, UserPosition>,
  )

  const answerCount = computed(() => Object.values(answers.value).length)
  const deleteAnswer = (questionId: string) => {
    if (answers.value[questionId]) delete answers.value[questionId]
  }

  const currentQuestionIndex = useStorage(
    'realomat-current-question-' + slug,
    0,
  )
  const currentQuestionProgress = computed(() => currentQuestionIndex.value + 1)

  const currentStage = useStorage<Stage>(
    'realomat-stage-' + slug,
    Stage.Tutorial,
  )

  const viewTransition = ref('slide' as 'slide' | 'slide-back')

  const getPartyMatches = (questions: Question[], parties: Party[]) => {
    const results: Record<string, number> = Object.fromEntries(
      parties.map((party) => [party.slug, 0]),
    )

    let denominator = 0

    for (const question of questions) {
      const { answer: userAnswer, weight } = answers.value[question.id] ?? {}
      if (!userAnswer) continue

      for (const { answer: partyAnswer, party } of question.answers) {
        if (userAnswer === partyAnswer) {
          results[party] += weight
        }
      }

      denominator += weight
    }

    return parties
      .map((party) => {
        const score = results[party.slug] ?? 0
        return {
          party: party.name,
          score,
          percentage: Math.round((score / denominator) * 100),
        }
      })
      .sort((a, b) => b.score - a.score)
  }

  const getFurtherInfo = (questions: Question[]) => {
    const answeredQuestionsWithInfo = questions.filter(
      (question) => answers.value[question.id] && question.info?.trim(),
    )
    console.log('questions', questions)
    console.log('answeredQuestionsWithInfo', answeredQuestionsWithInfo)
    const weightedQuestionsWithInfo = answeredQuestionsWithInfo.filter(
      (question) => answers.value[question.id].weight === 2,
    )
    const sampledQuestion =
      sample(weightedQuestionsWithInfo) || sample(answeredQuestionsWithInfo)

    return sampledQuestion?.info?.trim()
  }

  return {
    answers,
    deleteAnswer,
    answerCount,
    currentQuestionIndex,
    currentQuestionProgress,
    currentStage,
    viewTransition,
    getPartyMatches,
    getFurtherInfo,
  }
}
