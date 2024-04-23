import { ErrorCode } from "./ErrorCode.js"
import { DomainError } from "./DomainError.js"

export class RecipeAlreadyExists extends DomainError {
  constructor() {
    super("Recipe already exists", ErrorCode.RECIPE_ALREADY_EXISTS)
  }
}
