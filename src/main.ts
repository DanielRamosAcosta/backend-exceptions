import Koa from "koa"
import Router from "@koa/router"
import { bodyParser } from "@koa/bodyparser"
import logger from "koa-logger"
import cors from "@koa/cors"
import { z } from "zod"

const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
})

type Recipe = z.infer<typeof RecipeSchema>

const recipeRepository = new Map<string, Recipe>()

const app = new Koa()

app.use(cors())
app.use(bodyParser())
app.use(logger())

const router = new Router()

router
  .get("/recipes", (ctx) => {
    ctx.body = Array.from(recipeRepository.values())
  })
  .post("/recipes", (ctx) => {
    const recipe = RecipeSchema.parse(ctx.request.body)

    if (recipeRepository.has(recipe.name)) {
      ctx.status = 409
      return
    }

    recipeRepository.set(recipe.name, recipe)
    ctx.status = 201
  })
  .delete("/recipes/:name", (ctx) => {
    const { name } = ctx.params

    if (!recipeRepository.has(name)) {
      ctx.status = 404
      return
    }

    recipeRepository.delete(name)
    ctx.status = 204
  })

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 8000

app.listen(port)
