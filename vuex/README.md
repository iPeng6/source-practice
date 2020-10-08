# vuex

要点总结

1. **store 响应式实现，直接利用 Vue 实例数据的响应式**

   ```js
   this._vm = new Vue({
     data: {
       $$state: options.state,
     },
     computed,
   })
   ```

2. **getters 实现，利用 computed 计算属性实现**

   ```js
   const computed = {}

   Object.keys(options.getters).forEach((key) => {
     computed[key] = () => {
       return options.getters[key](this.state)
     }

     Object.defineProperty(this.getters, key, {
       get: () => this._vm[key],
     })
   })
   ```
