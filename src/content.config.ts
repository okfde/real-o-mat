import { defineCollection, z } from 'astro:content'
import { importGoogleSheet, cachedImportGoogleSheet } from './importGoogleSheet'
import { getSecret } from 'astro:env/server'
import { file } from 'astro/loaders'

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
export type Party = z.infer<typeof partySchema>

export const positionSchema = z.object({
  party: partySchema,
  answer: answerSchema,
  comment: z.string().optional(),
})
export type Position = z.infer<typeof positionSchema>

const questionSchema = z.object({
  id: z.string(),
  index: z.number(),
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
      getSecret('GOOGLE_SPREADSHEET_ID')!,
      getSecret('GOOGLE_SPREADSHEET_RANGE')!,
    )
  },
  schema: questionSchema,
})

const partners = defineCollection({
  loader: file("src/assets/partners.yaml"),
  schema: ({ image }) => z.object({
    name: z.string(),
    logo: image()
  }),
})
export type PartnersSchema = typeof partners.schema

export const collections = { questions, partners }
