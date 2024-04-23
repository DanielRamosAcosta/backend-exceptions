import { Recipe } from "./Recipe.js"

export interface RecipeRepository {
  findAll(): Promise<Recipe[]>
  save(recipe: Recipe): Promise<void>
  delete(name: string): Promise<void>
  exists(name: string): Promise<boolean>
}
