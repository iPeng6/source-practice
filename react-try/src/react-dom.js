function render(vnode, dom) {
  console.log(vnode)
  const { type, props } = vnode

  let el

  if (type === 'TEXT') {
    el = document.createTextNode(props.nodeValue)
  } else if (typeof type === 'symbol' || !type) {
    el = document.createDocumentFragment()
  } else if (typeof type === 'function') {
    if (type.isClassComponent) {
      const cVnode = new type(props).render()
      render(cVnode, dom)
    } else {
      const fVnode = type(props)
      render(fVnode, dom)
    }
    return
  } else {
    el = document.createElement(type)
    updateProps(el, props)
  }

  if (Array.isArray(vnode)) {
    updateChildren(vnode, el)
  } else {
    updateChildren(props.children, el)
  }

  dom.appendChild(el)
}

function updateChildren(children, parent) {
  if (!children) return
  if (Array.isArray(children)) {
    children.forEach((child) => {
      render(child, parent)
    })
  } else if (typeof children === 'object') {
    render(children, parent)
  } else {
    render({ type: 'TEXT', props: { nodeValue: children } }, parent)
  }
}

function updateProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key !== 'children') {
      el[key] = value
    }
  }
}
const ReactDom = {
  render,
}

export default ReactDom
