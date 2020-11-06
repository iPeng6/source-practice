# 要点总结

1. 中间件就是一些use过来的function，都是先存起来，然后想办法做任务编排组合

2. 洋葱模型主要就是一个compose方法实现实现任务的类递归调用

```js
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
```
