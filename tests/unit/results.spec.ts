import { expect, test } from 'vitest'
import type { Question } from '../../src/content.config'
import { partyNames, useStore, type UserPosition } from '../../src/store'

const questions: Question[] = [
  {
    id: 'test-1',
    index: 0,
    thesis: 'Test 1',
    category: 'Category',
    answers: [
      { party: 'spd', answer: 'zu weit' },
      { party: 'linke', answer: 'richtig' },
    ],
  },
  {
    id: 'test-2',
    index: 1,
    thesis: 'Test 2',
    category: 'Category',
    answers: [
      { party: 'spd', answer: 'nicht weit genug' },
      { party: 'linke', answer: 'richtig' },
    ],
  },
  {
    id: 'test-3',
    index: 2,
    thesis: 'Test 3',
    category: 'Category',
    answers: [
      { party: 'spd', answer: 'richtig' },
      { party: 'linke', answer: 'zu weit' },
    ],
  },
]

test('calculate correct results', async () => {
  const exampleAnswers: Record<string, UserPosition> = {
    'test-1': { answer: 'zu weit', weight: 1, questionId: 'test-1' },
    'test-2': { answer: 'richtig', weight: 1, questionId: 'test-2' },
    'test-3': { answer: 'zu weit', weight: 1, questionId: 'test-3' },
  }

  const { answers, getPartyMatches } = useStore()
  answers.value = exampleAnswers

  const matches = getPartyMatches(questions)
  expect(matches[0].party).toBe(partyNames['linke'])
  expect(matches[0].percentage).toBe(67)
  expect(matches[1].party).toBe(partyNames['spd'])
  expect(matches[1].percentage).toBe(33)

  matches.slice(2).forEach((match) => {
    expect(match.percentage).toBe(0)
  })

  expect.assertions(matches.length + 2)
})

test('calculate correct results with weights', async () => {
  const exampleAnswers: Record<string, UserPosition> = {
    'test-1': { answer: 'zu weit', weight: 2, questionId: 'test-1' },
    'test-2': { answer: 'richtig', weight: 1, questionId: 'test-2' },
    'test-3': { answer: 'zu weit', weight: 1, questionId: 'test-3' },
  }

  const { answers, getPartyMatches } = useStore()
  answers.value = exampleAnswers

  const matches = getPartyMatches(questions)
  expect(matches[0].party).toBe(partyNames['spd'])
  expect(matches[0].percentage).toBe(50)
  expect(matches[1].party).toBe(partyNames['linke'])
  expect(matches[1].percentage).toBe(50)

  matches.slice(2).forEach((match) => {
    expect(match.percentage).toBe(0)
  })

  expect.assertions(matches.length + 2)
})
