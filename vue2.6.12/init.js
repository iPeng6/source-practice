import { observe } from './observer'

export function initState(vm) {
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) initData(vm)
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}

function initProps(vm, props) {}
function initMethods(vm, methods) {
  Object.keys(methods).forEach((key) => {
    vm[key] = vm.$options.methods[key].bind(vm)
  })
}
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data() : data || {}

  Object.keys(data).forEach((key) => {
    proxy(vm, '_data', key)
  })

  observe(data)
}
function initComputed(vm, computeds) {}
function initWatch(vm, watches) {}

function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key]
    },
    set(newVal) {
      target[sourceKey][key] = newVal
    },
  })
}
