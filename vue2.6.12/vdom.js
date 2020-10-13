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
