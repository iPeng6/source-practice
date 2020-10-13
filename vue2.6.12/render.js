import VNode, { createTextVNode } from './vdom'

export function initRender(vm) {
  installRenderHelpers(vm) // 源码在 renderMixin(Vue) 时安装

  vm._c = (a, b, c, d) => createElement(vm, a, b, c)
}

function createElement(context, tag, data, children) {
  let vnode
  if (typeof tag === 'string') {
    // 源码定义了 isReservedTag 在 src/platforms/web/util/element.js
    if (['div,button,span'].includes(tag)) {
      vnode = new VNode(tag, data, children, undefined, context)
    } else {
      // unknown
      vnode = new VNode(tag, data, children, undefined, context)
    }
  } else {
    // direct component options / constructor 创建组件
    vnode = createComponent(tag, data, context, children)
  }
  return vnode
}

function createComponent(tag, data, context, children) {}

export function installRenderHelpers(target) {
  target._s = toString
  target._v = createTextVNode
}

function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) ||
      Object.prototype.toString.call(val).slice(8, -1) === 'Object'
    ? JSON.stringify(val, null, 2)
    : String(val)
}
