import { expect, test } from 'vitest'
import type { Party, Question } from '../../src/content.config'
import { useStore, type UserPosition } from '../../src/store'
import { getShareResultText } from '../../src/share'

const parties: Party[] = [
  { name: 'SPD', slug: 'spd', color: '#ff0000' },
  { name: 'Die Linke', slug: 'linke', color: '#be3075' },
]

const questions: Question[] = [
  {
    id: 'test-1',
    index: 0,
    thesis: 'Test 1',
    info: 'info for 1',
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
    info: 'info for 2',
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

  const { answers, getPartyMatches } = useStore('test')
  answers.value = exampleAnswers

  const matches = getPartyMatches(questions, parties)
  expect(matches[0].party).toBe('Die Linke')
  expect(matches[0].percentage).toBe(67)
  expect(matches[1].party).toBe('SPD')
  expect(matches[1].percentage).toBe(33)
})

test('calculate correct results with weights', async () => {
  const exampleAnswers: Record<string, UserPosition> = {
    'test-1': { answer: 'zu weit', weight: 2, questionId: 'test-1' },
    'test-2': { answer: 'richtig', weight: 1, questionId: 'test-2' },
    'test-3': { answer: 'zu weit', weight: 1, questionId: 'test-3' },
  }

  const { answers, getPartyMatches } = useStore('test')
  answers.value = exampleAnswers

  const matches = getPartyMatches(questions, parties)
  expect(matches[0].party).toBe('SPD')
  expect(matches[0].percentage).toBe(50)
  expect(matches[1].party).toBe('Die Linke')
  expect(matches[1].percentage).toBe(50)
})

test('prefers further info from a double-weighted thesis', () => {
  const { answers, getFurtherInfo } = useStore('test')
  answers.value = {
    'test-1': { answer: 'richtig', weight: 2, questionId: 'test-1' },
    'test-2': { answer: 'richtig', weight: 1, questionId: 'test-2' },
  }

  expect(getFurtherInfo(questions)).toBe('info for 1')
})

test('falls back to any answered thesis when no weighted one has info', () => {
  const { answers, getFurtherInfo } = useStore('test')
  // test-3 is weighted but has no info, so it must not win.
  answers.value = {
    'test-2': { answer: 'richtig', weight: 1, questionId: 'test-2' },
    'test-3': { answer: 'richtig', weight: 2, questionId: 'test-3' },
  }

  expect(getFurtherInfo(questions)).toBe('info for 2')
})

test('ignores theses the user did not answer', () => {
  const { answers, getFurtherInfo } = useStore('test')
  answers.value = {
    'test-1': { answer: 'richtig', weight: 1, questionId: 'test-1' },
  }

  expect(getFurtherInfo(questions)).toBe('info for 1')
})

test('returns undefined when no answered thesis has an info', () => {
  const { answers, getFurtherInfo } = useStore('test')
  answers.value = {
    'test-3': { answer: 'richtig', weight: 2, questionId: 'test-3' },
  }

  expect(getFurtherInfo(questions)).toBeUndefined()
})

test('build share result text with emoji bars', () => {
  const text = getShareResultText([
    { party: 'Partei 1', percentage: 100 },
    { party: 'Partei 2', percentage: 67 },
    { party: 'Partei 3', percentage: 33 },
    { party: 'Partei 4', percentage: 0 },

  ])

  expect(text).toContain('🟪🟪🟪🟪🟪🟪🟪🟪 100% Partei 1')
  expect(text).toContain('🟪🟪🟪🟪🟪⬜⬜⬜ 67% Partei 2')
  expect(text).toContain('🟪🟪🟪⬜⬜⬜⬜⬜ 33% Partei 3')
  expect(text).toContain('⬜⬜⬜⬜⬜⬜⬜⬜ 0% Partei 4')
})
