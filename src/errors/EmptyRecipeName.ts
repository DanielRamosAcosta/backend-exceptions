import { ErrorCode } from "./ErrorCode.js"
import { DomainError } from "./DomainError.js"

export class EmptyRecipeName extends DomainError {
  constructor() {
    super("Recipe name cannot be empty", ErrorCode.RECIPE_NAME_CANNOT_BE_EMPTY)
  }
}
