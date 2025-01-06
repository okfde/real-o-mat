import { defineCollection, z } from 'astro:content'
import { file } from 'astro/loaders'
import { importGoogleSheet, cachedImportGoogleSheet } from './importGoogleSheet'

export const answerSchema = z.enum([
  'nicht weit genug',
  'richtig',
  'zu weit',
  '/', // neutral
  '-', // undefined
])
export type Answer = z.infer<typeof answerSchema>

export const partySchema = z.enum([
  'spd',
  'cdu',
  'fdp',
  'gruene',
  'bsw',
  'linke',
  'afd',
])

export const positionSchema = z.object({
  party: partySchema,
  answer: answerSchema,
  comment: z.string().optional(),
})
export type Position = z.infer<typeof positionSchema>

const questionSchema = z.object({
  id: z.string(),
  thesis: z.string(),
  category: z.string(),
  answers: z.array(positionSchema),
})
export type Question = z.infer<typeof questionSchema>

const questions = defineCollection({
  loader: async () => {
    const fn = import.meta.env.DEV ? cachedImportGoogleSheet : importGoogleSheet

    return await fn(
      process.cwd() + '/service-account.json',
      import.meta.env.GOOGLE_SPREADSHEET_ID,
      import.meta.env.GOOGLE_SPREADSHEET_RANGE,
    )
  },
  schema: questionSchema,
})

export const collections = { questions }
