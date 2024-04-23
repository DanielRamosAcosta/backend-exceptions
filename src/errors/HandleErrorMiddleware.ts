import Koa from "koa"
import { ZodError } from "zod"
import { ErrorCode } from "./ErrorCode.js"
import { DomainError } from "./DomainError.js"

const errorToStatusCode: Record<ErrorCode, number> = {
  [ErrorCode.RECIPE_NOT_FOUND]: 404,
  [ErrorCode.RECIPE_ALREADY_EXISTS]: 409,
  [ErrorCode.RECIPE_NAME_CANNOT_BE_EMPTY]: 400,
  [ErrorCode.RECIPE_DESCRIPTION_CANNOT_BE_EMPTY]: 400,
  [ErrorCode.INVALID_PARAMETERS]: 400,
  [ErrorCode.INTERNAL_ERROR]: 500,
}

export async function handleErrorMiddleware(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  try {
    await next()
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      createHttpError(ctx, ErrorCode.INVALID_PARAMETERS, err.errors)
      return
    }
    if (err instanceof DomainError) {
      createHttpError(ctx, err.code, { message: err.message })
      return
    }

    createHttpError(ctx, ErrorCode.INTERNAL_ERROR, err)
  }
}

function createHttpError(ctx: Koa.ParameterizedContext, code: ErrorCode, payload: any) {
  ctx.status = errorToStatusCode[code]
  ctx.body = {
    status: "error",
    code,
    payload,
  }
}
