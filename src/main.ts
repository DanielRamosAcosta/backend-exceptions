import Koa from "koa"
import Router from "@koa/router"
import { bodyParser } from "@koa/bodyparser"
import logger from "koa-logger"
import cors from "@koa/cors"
import { RecipeSchema } from "./Recipe.js"
import { RecipeRepositoryMemory } from "./RecipeRepositoryMemory.js"
import { SearchRecipes } from "./SearchRecipes.js"
import { SearchRecipe } from "./CreateRecipes.js"
import { DeleteRecipe } from "./DeleteRecipe.js"
import { ZodError } from "zod"
import { RecipeNotFound } from "./errors/RecipeNotFound.js"
import { EmptyRecipeName } from "./errors/EmptyRecipeName.js"
import { EmptyRecipeDescription } from "./errors/EmptyRecipeDescription.js"
import { RecipeAlreadyExists } from "./errors/RecipeAlreadyExists.js"

const recipeRepository = new RecipeRepositoryMemory()
const searchRecipes = new SearchRecipes(recipeRepository)
const createRecipe = new SearchRecipe(recipeRepository)
const deleteRecipe = new DeleteRecipe(recipeRepository)

const app = new Koa()

app.use(cors())
app.use(bodyParser())
app.use(logger())

const router = new Router()

router
  .get("/recipes", async (ctx) => {
    ctx.body = await searchRecipes.search()
  })
  .post("/recipes", async (ctx) => {
    const recipe = RecipeSchema.parse(ctx.request.body)
    await createRecipe.create(recipe.name, recipe.description)
    ctx.status = 201
  })
  .delete("/recipes/:name", async (ctx) => {
    const name = ctx.params.name
    await deleteRecipe.delete(name)
    ctx.status = 204
  })

app.use(async (ctx, next) => {
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

      ctx.status = 500
      ctx.body = {
        status: "error",
        code: "unknown_error",
        payload: err,
      }
    }

    ctx.status = 500
    ctx.body = {
      status: "error",
      code: "unknown_error",
      payload: err,
    }
  }
})

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 8000

app.listen(port)
