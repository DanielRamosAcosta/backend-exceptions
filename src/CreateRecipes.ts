import { RecipeRepository } from "./RecipeRepository.js"
import { Recipe } from "./Recipe.js"
import { EmptyRecipeName } from "./errors/EmptyRecipeName.js"
import { EmptyRecipeDescription } from "./errors/EmptyRecipeDescription.js"
import { RecipeAlreadyExists } from "./errors/RecipeAlreadyExists.js"

export class SearchRecipe {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async create(name: string, description: string) {
    if (await this.recipeRepository.exists(name)) {
      throw new RecipeAlreadyExists()
    }

    if (!name) {
      throw new EmptyRecipeName()
    }

    if (!description) {
      throw new EmptyRecipeDescription()
    }

    const recipe: Recipe = {
      name,
      description,
    }

    await this.recipeRepository.save(recipe)
  }
}
