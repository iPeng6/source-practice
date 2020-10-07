# vue-router

要点总结

1. **全局注册 `$route` 实例，问题是怎么拿到这个实例，这里通过一个 mixin 在 beforeCreate 事件里过滤出根组件拿到实例，注册到全局**

   ```js
   Vue.mixin({
     beforeCreate() {
       // 判断只有根组件才有router实例
       if (this.$options.router) {
         Vue.prototype.$router = this.$options.router
       }
     },
   })
   ```

2. **如何监听路由变化**

- hash 方式，通过 `hashchange` 事件监听地址变化，直接更新当前路由
- history 模式的时候，分两种情况

  1.  主动跳转的时候，是程序直接拿到 to 值直接触发更新（源码里封装了统一的 history 做 updateRoute 处理）

      ```js
      // 比如：link
      if (this.$router._options.mode == 'history') {
        //<a href="/about">about</a>
        const handler = (e) => {
          e.preventDefault()

          window.history.pushState({}, null, this.to)
          // 手动更新
          this.$router.current = this.to
        }

        return h(
          'a',
          {
            attrs: { href: this.to },
            on: {
              click: handler,
            },
          },
          this.$slots.default
        )
      }
      ```

  2.  浏览器前进后退通过监听 `popstate` 事件 同 `hashchange`

3. **如何响应式更新组件**

   这里使用了 Vue 自带的 api，来实现响应式

   ```js
   _Vue.util.defineReactive(this, 'current', this.getUrl())
   ```

   在 render 函数里只要触发响应属性的 get 就会被依赖收集，从而在改变的时候触发更新，在 RouterView 出口组件里会根据当前 route 匹配出对应组件加以渲染，一个性能点是 routes 配置被提前 map 化，使得获取的复杂度变成哈希表的提取复杂度

   ```js
   export default {
     name: 'RouterView',
     render(h) {
       // 1. 拿到当前url 对应的组件
       const comp = this.$router.routeMap.get(this.$router.current)
       return h(comp)
     },
   }
   ```
