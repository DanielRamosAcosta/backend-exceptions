import { RecipeRepository } from "./RecipeRepository.js"

export class SearchRecipes {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async search() {
    return await this.recipeRepository.findAll()
  }
}
