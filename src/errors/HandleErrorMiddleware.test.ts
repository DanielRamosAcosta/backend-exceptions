import { describe, it, expect } from "vitest"
import { handleErrorMiddleware } from "./HandleErrorMiddleware.js"
import { RecipeSchema } from "../Recipe.js"
import Koa from "koa"
import { RecipeNotFound } from "./RecipeNotFound.js"
import { EmptyRecipeName } from "./EmptyRecipeName.js"
import { EmptyRecipeDescription } from "./EmptyRecipeDescription.js"
import { RecipeAlreadyExists } from "./RecipeAlreadyExists.js"

describe("HandleErrorMiddleware", () => {
  it("handles ZodError", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      RecipeSchema.parse({})
    })

    expect(ctx).toMatchSnapshot()
  })

  it("handles RecipeNotFound", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      throw new RecipeNotFound()
    })

    expect(ctx).toMatchSnapshot()
  })

  it("handles EmptyRecipeName", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      throw new EmptyRecipeName()
    })

    expect(ctx).toMatchSnapshot()
  })

  it("handles EmptyRecipeDescription", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      throw new EmptyRecipeDescription()
    })

    expect(ctx).toMatchSnapshot()
  })

  it("handles RecipeAlreadyExists", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      throw new RecipeAlreadyExists()
    })

    expect(ctx).toMatchSnapshot()
  })

  it("handles unknown Error instances", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      throw new Error("this is an unknown error")
    })

    expect(ctx).toMatchSnapshot()
  })

  it("handles non-error thrown", async () => {
    const ctx = {} as Koa.ParameterizedContext

    await handleErrorMiddleware(ctx, async () => {
      throw "this is not an error"
    })

    expect(ctx).toMatchSnapshot()
  })
})
