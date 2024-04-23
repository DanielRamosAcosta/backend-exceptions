import { Recipe } from "./Recipe.js"
import { RecipeRepository } from "./RecipeRepository.js"

export class RecipeRepositoryMemory implements RecipeRepository {
  private recipes = new Map<string, Recipe>()

  async delete(name: string): Promise<void> {
    this.recipes.delete(name)
  }

  async findAll(): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
  }

  async save(recipe: Recipe): Promise<void> {
    this.recipes.set(recipe.name, recipe)
  }

  async exists(name: string): Promise<boolean> {
    return this.recipes.has(name)
  }
}
