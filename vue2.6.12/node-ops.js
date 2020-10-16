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

export function setTextContent(node, text) {
  node.textContent = text
}

export function parentNode(node) {
  return node.parentNode
}

export function removeChild(node, child) {
  node.removeChild(child)
}
