import { RecipeRepository } from "./RecipeRepository.js"
import { Recipe } from "./Recipe.js"

export class SearchRecipe {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async create(name: string, description: string) {
    if (await this.recipeRepository.exists(name)) {
      throw new Error(`Recipe ${name} already exists`)
    }

    if (!name) {
      throw new Error("Recipe name cannot be empty")
    }

    if (!description) {
      throw new Error("Recipe description cannot be empty")
    }

    const recipe: Recipe = {
      name,
      description,
    }

    await this.recipeRepository.save(recipe)
  }
}
