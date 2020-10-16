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
    // TODO: diff
    // vnode.elm = createElm(vnode)

    // document.body.replaceChild(vnode.elm, oldVnode.elm)

    patchVnode(oldVnode, vnode)
  } else {
    // 首次挂载
    vnode.elm = createElm(vnode)

    nodeOps.insertBefore(document.body, vnode.elm, oldVnode)
    document.body.removeChild(oldVnode)
  }
}

function createElm(vnode, parentElm) {
  if (vnode.tag && vnode.children) {
    vnode.elm = nodeOps.createElement(vnode.tag)

    vnode.children.forEach((vn) => {
      const chElm = createElm(vn, vnode.elm)
      if (vn.data && vn.data.on) {
        Object.keys(vn.data.on).forEach((event) => {
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

function patchVnode(oldVnode, vnode, ownerArray, index) {
  const elm = (vnode.elm = oldVnode.elm)

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (!vnode.text) {
    if (oldCh && ch && oldCh !== ch) updateChildren(elm, oldCh, ch)
    else if (ch) {
      if (oldVnode.text) nodeOps.setTextContent(elm, '')
      addVnodes(elm, ch, 0, ch.length - 1)
    } else if (oldCh) {
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (oldVnode.text) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
}

// TODO: diff算法 新旧首位两两比较
function updateChildren(parentElm, oldCh, newCh) {
  for (let i = 0; i < oldCh.length; i++) {
    const oldVnode = oldCh[i]
    const newVnode = newCh[i]
    patchVnode(oldVnode, newVnode)
  }
}

function addVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm)
  }
}

function removeVnodes(vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      removeNode(ch.elm)
    }
  }
}

function removeNode(el) {
  const parent = nodeOps.parentNode(el)
  if (parent) {
    nodeOps.removeChild(parent, el)
  }
}
