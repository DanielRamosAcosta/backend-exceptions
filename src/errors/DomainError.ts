import { ErrorCode } from "./ErrorCode.js"

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
  ) {
    super(message)
  }
}
