import Koa from "koa"
import { ZodError } from "zod"
import { RecipeNotFound } from "./RecipeNotFound.js"
import { EmptyRecipeName } from "./EmptyRecipeName.js"
import { EmptyRecipeDescription } from "./EmptyRecipeDescription.js"
import { RecipeAlreadyExists } from "./RecipeAlreadyExists.js"

export async function handleErrorMiddleware(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  try {
    await next()
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      ctx.status = 400
      ctx.body = {
        status: "error",
        code: "invalid_params",
        payload: err.errors,
      }
      return
    }
    if (err instanceof Error) {
      if (err instanceof RecipeNotFound) {
        ctx.status = 404
        ctx.body = {
          status: "error",
          code: err.code,
          payload: {
            message: err.message,
          },
        }
        return
      }
      if (err instanceof EmptyRecipeName) {
        ctx.status = 400
        ctx.body = {
          status: "error",
          code: err.code,
          payload: {
            message: err.message,
          },
        }
        return
      }
      if (err instanceof EmptyRecipeDescription) {
        ctx.status = 400
        ctx.body = {
          status: "error",
          code: err.code,
          payload: {
            message: err.message,
          },
        }
        return
      }
      if (err instanceof RecipeAlreadyExists) {
        ctx.status = 409
        ctx.body = {
          status: "error",
          code: err.code,
          payload: {
            message: err.message,
          },
        }
        return
      }
    }

    ctx.status = 500
    ctx.body = {
      status: "error",
      code: "unknown_error",
      payload: err,
    }
  }
}
