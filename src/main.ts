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
      if (err.message.match(/does not exist/)) {
        ctx.status = 404
        ctx.body = {
          status: "error",
          code: "recipe_not_found",
          payload: {
            message: err.message,
          },
        }
        return
      }
      if (err.message.match(/Recipe name cannot be empty/)) {
        ctx.status = 400
        ctx.body = {
          status: "error",
          code: "recipe_name_must_not_be_empty",
          payload: {
            message: err.message,
          },
        }
        return
      }
      if (err.message.match(/Recipe description cannot be empty/)) {
        ctx.status = 400
        ctx.body = {
          status: "error",
          code: "recipe_description_must_not_be_empty",
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
