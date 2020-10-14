export function createElement(tagName) {
  return document.createElement(tagName)
}
export function createTextNode(data) {
  return document.createTextNode(data)
}

export function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function appendChild(node, child) {
  node.appendChild(child)
}
