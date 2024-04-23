import { ErrorCode } from "./ErrorCode.js"
import { DomainError } from "./DomainError.js"

export class EmptyRecipeDescription extends DomainError {
  constructor() {
    super("Recipe description cannot be empty", ErrorCode.RECIPE_DESCRIPTION_CANNOT_BE_EMPTY)
  }
}
