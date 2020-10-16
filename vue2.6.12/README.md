# Vue 2.6.12 源码阅读实现

vue 1.0 的问题

1. 模板递归遍历过程中只要碰到数据依赖就会创建 watcher，模板数据变大之后就会存在大量 watcher 影响性能

Vue 2.x 版增加了

1. 模板编译 => render 函数 => 虚拟 dom => patch diff => 真实 dom
2. 所有属性依赖收集都会收集 RootWatcher 这**一个** watcher， RootWatcher 的更新函数就是负责更新组件，所以任意响应数据变化都会通知到这个 RootWatcher 进而触发整个组件 update
3. 因为是整个组件更新所以需要 diff 算法改进性能

## 流程梳理

```js
Vue.prototype.__patch__
Vue.prototype.$mount

initMixin(Vue) {
  Vue.prototype._init = function (options?: Object) {...}
}
stateMixin(Vue) // $data, $props, $set, $delete, $watch 挂载
eventsMixin(Vue) // $on, $once, $off, $emit 挂载
lifecycleMixin(Vue) // _update, $forceUpdate, $destroy
renderMixin(Vue) // installRenderHelpers(_o\_n\_s..), $nextTick, _render 渲染函数就是为了得到虚拟dom
    _render() {
      vnode = render.call(vm._renderProxy, vm.$createElement)
      return vnode
    }

initGlobalAPI(Vue) {
  Vue.util = { warn, extend, mergeOptions, defineReactive }
  Vue.set = set // 响应式set
  Vue.delete = del // 响应式delete
  Vue.nextTick = nextTick
  Vue.observable // observe(obj)

  extend(Vue.options.components, builtInComponents) // 合并组件

  initUse(Vue)  // Vue.use()方法，插件使用
  initMixin(Vue) // Vue.mixin()方法，mixin合并
  initExtend(Vue) // Vue.extend()方法，继承Vue得到子组件构造函数
  initAssetRegisters(Vue) // Vue.component(),Vue.directive(),Vue.filter()
}

function Vue (options) {
  this._init(options) {
    initLifecycle(vm) // $parent,$root,$children,$refs
    initEvents(vm) // 处理父组件传递的事件和回调
    initRender(vm) // $slots, $scopedSlots, _c, $createElement, $attrs, $listeners
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm) // initProps, initMethods, observe(data), initComputed, initWatch(user)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
  }
}

Vue.prototype.$mount = function() {
  1.render不存在
    2.template
    3.el
      template= getOuterHTML(el)
    4.{ render } = compileToFunctions(template)
  // 主要目的获得 render 函数
  call mountComponent() {
    callHook(vm, 'beforeMount')

    updateComponent(){
      vm._update(vm._render(), hydrating)
    }
    new Watcher(vm, updateComponent, noop, {
        before () {
          if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
          }
        }
      }, true /* isRenderWatcher */) //if (isRenderWatcher) { vm._watcher = this } // sss

    (vm, expOrFn, cb, options, isRenderWatcher) {
      // watcher 会立即触发一次get， 执行一次 updateComponent
      if (typeof expOrFn === 'function') {
        this.getter = expOrFn
      }
      value = this.getter.call(vm, vm)

    }
    callHook(vm, 'mounted')
}


```

1. import Vue 之后

   - `$data, $props`等在`Vue.prototype`上的 get,set 挂载

   - `$set, $delete, $watch、$on, $once, $off, $emit`等方法在`Vue.prototype`上的全局挂载

2. new Vue() 实例之后
   - ` $parent,$root,$children,$refs, $slots,$createElement, $attrs, $listeners`等在 vm 实例上的挂载
   - callHook(vm, 'beforeCreate')
   - inject 数据处理
   - initProps, initMethods, initComputed, initWatch(user)
   - **observe(data) 数据响应式处理**
   - provide 处理
3. \$mount

   - 得到渲染函数
   - mountComponent
     - 创建 watcher
     - 触发更新 updateComponent
       - vm.\_update(vm.\_render(), hydrating)

4. 数据修改更新
   1. patch
      1. 首次 createElm
      2. diff updateChildren

### 模板编译

```html
<div id="app">
  <button @click="add">click</button>
</div>
```

得到 ast

```js
ast = {
  type: 1,
  tag: 'div',
  attrsList: [{ name: 'id', value: 'app' }],
  children: [
    {
      type: 1,
      tag: 'button',
      attrsList: [{ name: '@click', value: 'add' }],
      children: [{ type: 3, text: 'click' }],
      parent: {},
    },
  ],
  parent: undefined,
}
```

generate 生成 render 函数

```js
;(function anonymous() {
  with (this) {
    return _c('div', { attrs: { id: 'app' } }, [
      _c('button', { on: { click: add } }, [_v(_s(count))]),
    ])
  }
})
```

执行 render 函数得到 VNode

```js
vnode = {
  tag:'divta
  data:{attrs:{id:'app'}},
  children:[
    {
      tag: 'button',
    	data:{on:{click:add()}},
      children:[
        {text:0,context:vm}
      ],
      context:vm
    }
  ],
  context:vm
}
```

VNode 生成 dom

```js
export function patch(oldVnode, vnode) {
  console.log('patch', oldVnode, vnode)
  if (oldVnode instanceof VNode) {
    // diff更新
    patchVnode(oldVnode, vnode)
  } else {
    // 首次挂载
    vnode.elm = createElm(vnode, document.body)

    nodeOps.insertBefore(document.body, vnode.elm, oldVnode)
    document.body.removeChild(oldVnode)
  }
}
function createElm(vnode, parentElm) {
  // console.log(vnode.tag)
  if (vnode.tag) {
    vnode.elm = nodeOps.createElement(vnode.tag)

    vnode.children.forEach((vn) => {
      const chElm = createElm(vn, vnode.elm)
      if (vn.data && vn.data.on) {
        Object.keys(vn.data.on).forEach((event) => {
          console.log('listener')
          chElm.addEventListener(event, () => {
            console.log('click')
            vn.data.on[event]()
          })
        })
      }
    })
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
  }

  if (parentElm) {
    nodeOps.appendChild(parentElm, vnode.elm)
  }
  return vnode.elm
}
```
