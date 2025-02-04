import { defineCollection, z } from 'astro:content'
import { file } from 'astro/loaders'

export const answerSchema = z.enum([
  'nicht weit genug',
  'richtig',
  'zu weit',
  '/', // unklar
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

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
})
export type FAQItem = z.infer<typeof faqItemSchema>

const questions = defineCollection({
  loader: file('src/data/theses.yaml'),
  schema: questionSchema,
})

const faq = defineCollection({
  loader: file('src/data/faq.yaml'),
  schema: faqItemSchema,
})

const partners = defineCollection({
  loader: file('src/data/partners.yaml'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image(),
    }),
})
export type PartnersSchema = typeof partners.schema

export const collections = { questions, partners, faq }
