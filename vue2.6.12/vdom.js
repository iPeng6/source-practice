import * as nodeOps from './node-ops'

export default class VNode {
  constructor(tag, data, children, text, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.context = context
  }
}

export function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

export function patch(oldVnode, vnode) {
  console.log('patch', oldVnode, vnode)
  if (oldVnode instanceof VNode) {
    // diff todo
    const root = createNode(vnode)
    vnode.el = root
    document.body.replaceChild(root, oldVnode.el)
  } else {
    // 首次挂载
    const root = createNode(vnode)
    vnode.el = root
    nodeOps.insertBefore(document.body, root, oldVnode)
    document.body.removeChild(oldVnode)
  }

  function createNode(vnode, parent) {
    let node
    if (vnode.tag && vnode.children) {
      node = nodeOps.createElement(vnode.tag)
      vnode.children.forEach((vn) => {
        const dom = createNode(vn, node)
        if (vn.data && vn.data.on) {
          Object.keys(vn.data.on).forEach((event) => {
            dom.addEventListener(event, () => {
              console.log('click')
              vn.data.on[event]()
            })
          })
        }
      })
    } else {
      node = nodeOps.createTextNode(vnode.text)
    }

    if (parent) {
      nodeOps.appendChild(parent, node)
    }
    return node
  }
}
