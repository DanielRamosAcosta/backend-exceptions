import { RecipeRepository } from "./RecipeRepository.js"
import { Recipe } from "./Recipe.js"
import { RecipeNotFound } from "./errors/RecipeNotFound.js"

export class DeleteRecipe {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async delete(name: string) {
    if (!(await this.recipeRepository.exists(name))) {
      throw new RecipeNotFound()
    }

    await this.recipeRepository.delete(name)
  }
}
