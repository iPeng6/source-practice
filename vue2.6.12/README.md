# Vue 2.6.12 源码阅读实现

与 vue1.0 相比 2.6.x 版增加了

1. 虚拟 dom

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
