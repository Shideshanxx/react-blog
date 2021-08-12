const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const Redis = require('ioredis')
const koaBody = require('koa-body')
const atob = require('atob')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// 创建redis client
const redis = new Redis()

// 设置nodejs全局增加一个atob方法
global.atob = atob

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['develop Github App']

  server.use(koaBody())

  server.use(router.routes())

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.listen(3000, () => {
    console.log('koa server listening on 3000')
  })
})
