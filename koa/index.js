// const Koa = require('koa')
const Koa = require('./koa')

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = '1'
  await next()
  ctx.body += '1'
})

app.use(async (ctx, next) => {
  ctx.body += '2'
  await next()
  ctx.body += '2'
})

app.use(async (ctx, next) => {
  ctx.body += '3'
  await next()
  ctx.body += '3'
})

app.listen(3001)
