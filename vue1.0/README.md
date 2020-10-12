# Vue 1.0

要点总结

1. 响应式实现 `Object.defineProperty`

   ```js
   Object.defineProperty(obj, key, {
     get() {
       console.log('get:', key, val)
       // 依赖收集
       if (Dep.target) {
         dep.depend()
       }
       return val
     },
     set(newVal) {
       if (newVal === val) return
       console.log('set:', key, newVal, val)
       val = newVal
       dep.notify()
     },
   })
   ```

2. 模板编译和 watcher 创建

   ```js
   Compile.prototype._compile = function (el) {
     const childNodes = el.childNodes
     Array.from(childNodes).forEach((node) => {
       if (node.nodeType === 1 && node.tagName !== 'SCRIPT') {
         this.compileElement(node)
       } else if (node.nodeType === 3 && node.data.trim()) {
         this.compileTextNode(node)
       }
       if (node.childNodes && node.childNodes.length > 0) {
         this._compile(node)
       }
     })
   }
   Compile.prototype.directives = {
     bind(node, exp, attrName, vm) {
       node.removeAttribute(attrName)
       const attr = attrName.replace('v-bind:', '')
       const watcher = new Watcher(vm, exp, () => {
         node.setAttribute(attr, vm[exp])
       })
       watcher.update()
     },
   }
   ```

3. 双向绑定 添加 dom 事件，然后通过 watcher 更新 value

   ```js
   Compile.prototype.directives = {
     model(node, exp, vm) {
       node.addEventListener('input', (e) => {
         vm[exp] = e.target.value
       })
       const watcher = new Watcher(vm, exp, () => {
         node.value = vm[exp]
       })
       watcher.update()
     },
   }
   ```
