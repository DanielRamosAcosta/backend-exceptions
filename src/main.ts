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
import { handleErrorMiddleware } from "./errors/HandleErrorMiddleware.js"

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

app.use(handleErrorMiddleware)

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 8000

app.listen(port)
