import Watcher from './watcher'
import { compileToFunctions } from './compiler'
import { initState } from './init'
import { initRender } from './render'
import { patch } from './vdom'

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

  // Watcher的第二个参数如果是function 会被立即执行，所以立即_update 立即 patch，patch就是直接操作dom了
  // callHook(vm, 'mounted')
}

Vue.prototype._render = function () {
  console.log('render: get vnode')
  const vm = this
  const vnode = vm.$options.render.call(vm, vm.$createElement)
  return vnode
}

let prevVnode
Vue.prototype._update = function (vnode) {
  console.log('update: vnode => dom', vnode)
  const vm = this

  if (!prevVnode) {
    // initial render
    vm.$el = patch(vm.$el, vnode)
  } else {
    // updates
    vm.$el = patch(prevVnode, vnode)
  }

  prevVnode = vnode
}

function noop() {}
export default Vue
