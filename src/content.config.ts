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

const answer = z.enum(['yes', 'no', 'neutral'])

const questions = defineCollection({
  loader: file('src/data/questions.yaml'),
  schema: z.object({
    id: z.number(),
    question: z.string(),
    category: z.string(),
    answers: z.object({
      cdu: answer,
      spd: answer,
      fdp: answer,
      gruene: answer,
      linke: answer,
      bsw: answer,
      afd: answer,
    }),
  }),
})

export const collections = { questions }
