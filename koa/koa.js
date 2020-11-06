const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application {
  middlewares = []

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      // todo middleware
      const ctx = this.createContext(req, res)
      const fn = this.compose(this.middlewares)
      await fn(ctx)
      res.end(ctx.body)
    })
    server.listen(...args)
  }
  use(callback) {
    this.middlewares.push(callback)
  }
  compose(middlewares) {
    return (ctx) => {
      return dispatch(0)
      function dispatch(i) {
        if (i >= middlewares.length) {
          return Promise.resolve()
        } else {
          middlewares[i](ctx, () => {
            return Promise.resolve(dispatch(i + 1))
          })
        }
      }
    }
  }
  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = context.request = Object.create(request)
    ctx.response = context.response = Object.create(response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }
}

module.exports = Application
