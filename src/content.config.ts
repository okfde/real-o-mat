import { defineCollection, z } from 'astro:content'
import { file } from 'astro/loaders'

// const categories = defineCollection({
//   loader: file('src/data/categories.yaml'),
//   schema: z.array(
//     z.object({
//       title: z.string(),
//     }),
//   ),
// })

export const answerSchema = z.enum(['yes', 'no', 'neutral'])
export type Answer = z.infer<typeof answerSchema>

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.string(),
  answers: z.object({
    cdu: answerSchema,
    spd: answerSchema,
    fdp: answerSchema,
    gruene: answerSchema,
    linke: answerSchema,
    bsw: answerSchema,
    afd: answerSchema,
  }),
})
export type Question = z.infer<typeof questionSchema>

const questions = defineCollection({
  loader: file('src/data/questions.yaml'),
  schema: questionSchema,
})

export const collections = { questions }
