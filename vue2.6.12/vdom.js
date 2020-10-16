import * as nodeOps from './node-ops'

export default class VNode {
  constructor(tag, data, children, text, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.context = context
    this.key = data && data.key
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

function patchVnode(oldVnode, vnode) {
  const elm = (vnode.elm = oldVnode.elm) // 直接复用dom

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

// diff算法
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[0]
  let newStartVnode = newCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndVnode = newCh[newEndIdx]

  let refElm

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 这里oldVnode 不存在 是因为，之前的比对中根据key 找出来挪走了
    if (!oldStartVnode) {
      oldStartVnode = [++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = [--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 老头 新尾
      patchVnode(oldStartVnode, newEndVnode)
      nodeOps.insertBefore(
        parentElm,
        oldStartVnode.elm,
        nodeOps.nextSibling(oldEndVnode.elm)
      )
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, newStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // TODO: 如果以上都没匹配到，就根据新的key 从老的节点里 把它找出来，然后挪到 newStartIdx 的位置，并清空
      createElm(newStartVnode, parentElm)
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (oldStartIdx > oldEndIdx) {
    refElm = !newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
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
    if (ch) {
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

function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag
}
