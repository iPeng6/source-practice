let nextUnitOfWork = null
let rootFiber = null
let wipRoot = null

function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  console.log(fiber)
  const { type, props } = fiber
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }

  let children = fiber.props.children

  if (typeof fiber.type === 'function') {
    if (type.isClassComponent) {
      const cVnode = new type(props).render()
      children = cVnode
    } else {
      const fVnode = type(props)
      children = fVnode
    }
  }

  if (Array.isArray(children)) {
    let index = 0
    let prevSibling = null
    while (index < children.length) {
      const curVnode = children[index]
      let newFiber
      if (Array.isArray(curVnode)) {
        newFiber = {
          type: 'FRAGMENT',
          props: { children: curVnode },
          parent: fiber,
          dom: null,
        }
      } else {
        newFiber = {
          type: curVnode.type,
          props: curVnode.props,
          parent: fiber,
          dom: null,
        }
      }

      if (index === 0) {
        fiber.child = newFiber
      } else {
        prevSibling.sibling = newFiber
      }
      prevSibling = newFiber
      index++
    }
  } else if (typeof children === 'object') {
    const newFiber = {
      type: children.type,
      props: children.props,
      parent: fiber,
      dom: null,
    }
    fiber.child = newFiber
  } else if (typeof children === 'string' || typeof children === 'number') {
    const newFiber = {
      type: 'TEXT',
      props: { nodeValue: children },
      parent: fiber,
      dom: null,
    }
    fiber.child = newFiber
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function render(vnode, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vnode],
    },
  }
  wipRoot = nextUnitOfWork
  window.rootFiber = nextUnitOfWork
}

function createDom(fiber) {
  const { type, props } = fiber

  let el

  if (type === 'TEXT') {
    el = document.createTextNode(props.nodeValue)
  } else if (type === 'FRAGMENT' || typeof type === 'symbol') {
    el = document.createDocumentFragment()
  } else if (typeof type === 'function') {
    el = document.createDocumentFragment()
  } else {
    el = document.createElement(type)
    updateProps(el, props)
  }

  return el
}

function updateProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key !== 'children') {
      el[key] = value
    }
  }
}

function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  if (fiber.child) {
    commitWork(fiber.child)
  }

  if (fiber.sibling) {
    commitWork(fiber.sibling)
  }

  const parentDom = fiber.parent.dom
  parentDom.prepend(fiber.dom)
}

const ReactDom = {
  render,
}

export default ReactDom
