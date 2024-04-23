import { ErrorCode } from "./ErrorCode.js"
import { DomainError } from "./DomainError.js"

export class RecipeNotFound extends DomainError {
  constructor() {
    super("Recipe not found", ErrorCode.RECIPE_NOT_FOUND)
  }
}
