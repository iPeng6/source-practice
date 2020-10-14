import Watcher from './watcher'
import { compileToFunctions } from './compiler'
import { initState } from './init'
import { initRender } from './render'

function Vue(options) {
  this._watcher = null
  this._watchers = []
  this._init(options)
}

Vue.prototype.$forceUpdate = function () {
  const vm = this
  if (vm._watcher) {
    vm._watcher.update()
  }
}

Vue.prototype._init = function (options) {
  this.$options = options
  const vm = this
  initRender(vm) // $slots, $scopedSlots, _c, $createElement, $attrs, $listeners
  // callHook(vm, 'beforeCreate')
  initState(vm)
  // callHook(vm, 'created')
  this.$mount(options.el)
}

Vue.prototype.$mount = function (el) {
  el = document.querySelector(el)
  this.$options.render = compileToFunctions(el.outerHTML)
  return this.mountComponent(this, el)
}

Vue.prototype.mountComponent = function (vm, el) {
  this.$el = el
  // callHook(vm, 'beforeMount')
  let updateComponent = function () {
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, noop, {}, true)

  // callHook(vm, 'mounted')
}

Vue.prototype._render = function () {
  console.log('render: get vnode')
  const vm = this
  const vnode = vm.$options.render.call(vm, vm.$createElement)
  return vnode
}

Vue.prototype._update = function (vnode) {
  console.log('update: vnode => dom', vnode)
}

function noop() {}
export default Vue
