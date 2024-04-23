import { RecipeRepository } from "./RecipeRepository.js"
import { Recipe } from "./Recipe.js"

export class DeleteRecipe {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async delete(name: string) {
    if (!(await this.recipeRepository.exists(name))) {
      throw new Error(`Recipe ${name} does not exist`)
    }

    await this.recipeRepository.delete(name)
  }
}
