import { z } from "zod"

export const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export type Recipe = z.infer<typeof RecipeSchema>
