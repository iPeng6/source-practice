(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Vue"] = factory();
	else
		root["Vue"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./compiler.js":
/*!*********************!*\
  !*** ./compiler.js ***!
  \*********************/
/*! namespace exports */
/*! export compileToFunctions [provided] [no usage info] [missing usage info prevents renaming] */
/*! export unicodeRegExp [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compileToFunctions": () => /* binding */ compileToFunctions,
/* harmony export */   "unicodeRegExp": () => /* binding */ unicodeRegExp
/* harmony export */ });
// import { parse } from './vue-srouce/src/compiler/parser'
// import { generate } from './vue-srouce/src/compiler/codegen/index'

function compileToFunctions(template) {
  // 编译模板
  console.log('compileToFunctions')

  // 1. parse => ast
  const ast = parse(template.trim())
  console.log('ast', ast)
  // 2. ast => generate => code
  const code = generate(ast)

  return new Function(code.render)
}

const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签 '<div'
const startTagClose = /^\s*(\/?)>/ // 匹配结束标签 ' >' ' />'
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

function parse(html) {
  const stack = []
  let index = 0
  let last
  while (html) {
    last = html
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 结束标签
      // End tag:
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        stack.pop()
        currentParent = stack[stack.length - 1]
        continue
      }
      // 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
        continue
      }
    }
    let text, rest, next
    if (textEnd >= 0) {
      rest = html.slice(textEnd)
      while (!endTag.test(rest) && !startTagOpen.test(rest)) {
        // < in plain text, be forgiving and treat it as text
        next = rest.indexOf('<', 1)
        if (next < 0) break
        textEnd += next
        rest = html.slice(textEnd)
      }
      text = html.substring(0, textEnd) // 获得标签内容
    }
    if (textEnd < 0) {
      text = html
    }

    if (text) {
      advance(text.length)
      if (currentParent && text.trim()) {
        const res = parseText(text)
        let child
        if (res) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text,
          }
        } else {
          child = {
            type: 3,
            text,
          }
        }
        currentParent.children.push(child)
      }
    }

    if (html === last) {
      break
    }
  }

  function advance(n) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  function handleStartTag(match) {
    const tagName = match.tagName

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''

      attrs[i] = {
        name: args[1],
        value,
      }
    }

    // createASTElement
    let element = createASTElement(tagName, attrs, currentParent)
    stack.push(element)
    if (currentParent) {
      currentParent.children.push(element)
      currentParent = element
    }

    if (!root) {
      root = currentParent = element
    }

    processAttrs(element)
  }

  return root
}

let root // 用于最后返回整棵树
let currentParent // 用于构建ast树

function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: [],
  }
}

function makeAttrsMap(attrs) {
  const map = new Map()
  attrs.forEach(({ name, value }) => {
    map.set(name, value)
  })

  return map
}
const onRE = /^@|^v-on:/
function processAttrs(el) {
  let events
  el.attrsList.forEach((attr) => {
    let { name, value } = attr
    // v-on
    if (onRE.test(name)) {
      name = name.replace(onRE, '')
      if (!events) events = {}
      events[name] = {
        value,
      }
    }
    //v-for
    if (name === 'v-for') {
      const [alias, forItems] = value.split(' in ')
      el.alias = alias
      el.for = forItems
    }
    if (name === ':key') {
      el.key = value
    }
  })
  if (events) {
    el.events = events
  }
}

const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function parseText(text) {
  if (!tagRE.test(text)) {
    return
  }
  const tokens = []
  const rawTokens = []
  let lastIndex = (tagRE.lastIndex = 0)
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      rawTokens.push((tokenValue = text.slice(lastIndex, index)))
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = match[1].trim()
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push((tokenValue = text.slice(lastIndex)))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens,
  }
}
function generate(ast) {
  const code = ast ? genElement(ast) : '_c("div")'
  console.log(code)
  return {
    render: `with(this){return ${code}}`,
  }
}

function genElement(ast) {
  if (ast.for && !ast.forProcessed) {
    return genFor(ast)
  }
  return `_c('${ast.tag}', ${genData(ast)}, ${getChildren(ast)})`
}

function getChildren(ast) {
  if (!ast) return ''

  return `[${ast.children
    .map((child) => {
      if (child.type === 1) {
        return genElement(child)
      } else {
        return genText(child)
      }
    })
    .join(',')}]`
}

function genText(text) {
  return `_v(${text.type === 2 ? text.expression : JSON.stringify(text.text)})`
}

function genData(ast) {
  let data = '{'

  const attrs = ast.attrsList
    .filter((attr) => {
      if (attr.name === ':key') return false
      if (attr.name.startsWith('v-')) return false
      if (ast.events && ast.attrsMap.has(attr.name)) {
        return false
      }
      return true
    })
    .map((attr) => `${attr.name}: '${attr.value}'`)
    .join(',')

  if (ast.key) {
    data += `key:${ast.key},`
  }
  if (attrs !== '') {
    data += `attrs:{${attrs}},`
  }
  if (ast.events) {
    data += `on:{${Object.keys(ast.events)
      .map((ev) => `${ev}:${ast.events[ev].value}`)
      .join(',')}}`
  }
  data += '}'
  return data
}

function genFor(el) {
  const exp = el.for
  const alias = el.alias

  el.forProcessed = true // 避免死循环
  return (
    `_l((${exp}),` + `function(${alias}){` + `return ${genElement(el)}` + '})'
  )
}


/***/ }),

/***/ "./dep.js":
/*!****************!*\
  !*** ./dep.js ***!
  \****************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export popTarget [provided] [no usage info] [missing usage info prevents renaming] */
/*! export pushTarget [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Dep,
/* harmony export */   "pushTarget": () => /* binding */ pushTarget,
/* harmony export */   "popTarget": () => /* binding */ popTarget
/* harmony export */ });
let uid = 0
class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  depend() {
    Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
Dep.target = null
const targetStack = []

function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}


/***/ }),

/***/ "./init.js":
/*!*****************!*\
  !*** ./init.js ***!
  \*****************/
/*! namespace exports */
/*! export initState [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initState": () => /* binding */ initState
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ "./observer.js");


function initState(vm) {
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

  ;(0,_observer__WEBPACK_IMPORTED_MODULE_0__.observe)(data)
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


/***/ }),

/***/ "./node-ops.js":
/*!*********************!*\
  !*** ./node-ops.js ***!
  \*********************/
/*! namespace exports */
/*! export appendChild [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createTextNode [provided] [no usage info] [missing usage info prevents renaming] */
/*! export insertBefore [provided] [no usage info] [missing usage info prevents renaming] */
/*! export nextSibling [provided] [no usage info] [missing usage info prevents renaming] */
/*! export parentNode [provided] [no usage info] [missing usage info prevents renaming] */
/*! export removeChild [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setTextContent [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => /* binding */ createElement,
/* harmony export */   "createTextNode": () => /* binding */ createTextNode,
/* harmony export */   "insertBefore": () => /* binding */ insertBefore,
/* harmony export */   "appendChild": () => /* binding */ appendChild,
/* harmony export */   "setTextContent": () => /* binding */ setTextContent,
/* harmony export */   "parentNode": () => /* binding */ parentNode,
/* harmony export */   "removeChild": () => /* binding */ removeChild,
/* harmony export */   "nextSibling": () => /* binding */ nextSibling
/* harmony export */ });
function createElement(tagName) {
  return document.createElement(tagName)
}
function createTextNode(data) {
  return document.createTextNode(data)
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

function appendChild(node, child) {
  node.appendChild(child)
}

function setTextContent(node, text) {
  node.textContent = text
}

function parentNode(node) {
  return node.parentNode
}

function removeChild(node, child) {
  node.removeChild(child)
}

function nextSibling(node) {
  return node.nextSibling
}


/***/ }),

/***/ "./observer.js":
/*!*********************!*\
  !*** ./observer.js ***!
  \*********************/
/*! namespace exports */
/*! export Observor [provided] [no usage info] [missing usage info prevents renaming] */
/*! export observe [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Observor": () => /* binding */ Observor,
/* harmony export */   "observe": () => /* binding */ observe
/* harmony export */ });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ "./dep.js");


class Observor {
  constructor(value) {
    this.value = value
    this.dep = new _dep__WEBPACK_IMPORTED_MODULE_0__.default()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 1. 数组方法 响应式处理
      // 2. 子项继续递归
      value.forEach((item) => {
        observe(item)
      })
    } else {
      this.walk(value)
    }
  }
  walk(value) {
    Object.keys(value).forEach((key) => {
      defineReactive(value, key)
    })
  }
}

function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observor(value)
}

function defineReactive(obj, key) {
  const dep = new _dep__WEBPACK_IMPORTED_MODULE_0__.default()
  let val = obj[key]
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key, val)
      if (_dep__WEBPACK_IMPORTED_MODULE_0__.default.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(val)) {
            val.forEach((item) => {
              observe(item)
            })
          }
        }
      }
      return val
    },
    set(newVal) {
      console.log('set', key, val, newVal)
      if (newVal === val) return
      val = newVal
      childOb = observe(newVal)
      dep.notify()
    },
  })
}

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}


/***/ }),

/***/ "./render.js":
/*!*******************!*\
  !*** ./render.js ***!
  \*******************/
/*! namespace exports */
/*! export initRender [provided] [no usage info] [missing usage info prevents renaming] */
/*! export installRenderHelpers [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initRender": () => /* binding */ initRender,
/* harmony export */   "installRenderHelpers": () => /* binding */ installRenderHelpers
/* harmony export */ });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vdom */ "./vdom.js");


function initRender(vm) {
  installRenderHelpers(vm) // 源码在 renderMixin(Vue) 时安装

  vm._c = (a, b, c, d) => createElement(vm, a, b, c)
}

function createElement(context, tag, data, children) {
  let vnode
  if (typeof tag === 'string') {
    // children 数组打平
    const childs = children.flat()
    // 源码定义了 isReservedTag 在 src/platforms/web/util/element.js
    if (['div,button,span'].includes(tag)) {
      vnode = new _vdom__WEBPACK_IMPORTED_MODULE_0__.default(tag, data, childs, undefined, context)
    } else {
      // unknown
      vnode = new _vdom__WEBPACK_IMPORTED_MODULE_0__.default(tag, data, childs, undefined, context)
    }
  } else {
    // direct component options / constructor 创建组件
    vnode = createComponent(tag, data, context, children)
  }
  return vnode
}

function createComponent(tag, data, context, children) {}

function installRenderHelpers(target) {
  target._s = toString
  target._v = _vdom__WEBPACK_IMPORTED_MODULE_0__.createTextVNode
  target._l = renderList
}

function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) ||
      Object.prototype.toString.call(val).slice(8, -1) === 'Object'
    ? JSON.stringify(val, null, 2)
    : String(val)
}

function renderList(val, render) {
  const ret = val.map((item) => render(item))
  return ret
}


/***/ }),

/***/ "./vdom.js":
/*!*****************!*\
  !*** ./vdom.js ***!
  \*****************/
/*! namespace exports */
/*! export createTextVNode [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export patch [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ VNode,
/* harmony export */   "createTextVNode": () => /* binding */ createTextVNode,
/* harmony export */   "patch": () => /* binding */ patch
/* harmony export */ });
/* harmony import */ var _node_ops__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node-ops */ "./node-ops.js");


class VNode {
  constructor(tag, data, children, text, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.context = context
    this.key = data && data.key
  }
}

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function patch(oldVnode, vnode) {
  console.log('patch', oldVnode, vnode)
  if (oldVnode instanceof VNode) {
    // diff更新
    patchVnode(oldVnode, vnode)
  } else {
    // 首次挂载
    vnode.elm = createElm(vnode, document.body)

    _node_ops__WEBPACK_IMPORTED_MODULE_0__.insertBefore(document.body, vnode.elm, oldVnode)
    document.body.removeChild(oldVnode)
  }
}

function createElm(vnode, parentElm, refElm) {
  // console.log(vnode.tag)
  if (vnode.tag) {
    vnode.elm = _node_ops__WEBPACK_IMPORTED_MODULE_0__.createElement(vnode.tag)

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
    vnode.elm = _node_ops__WEBPACK_IMPORTED_MODULE_0__.createTextNode(vnode.text)
  }

  if (parentElm) {
    if (refElm) {
      _node_ops__WEBPACK_IMPORTED_MODULE_0__.insertBefore(parentElm, vnode.elm, refElm)
    } else {
      _node_ops__WEBPACK_IMPORTED_MODULE_0__.appendChild(parentElm, vnode.elm)
    }
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
      if (oldVnode.text) _node_ops__WEBPACK_IMPORTED_MODULE_0__.setTextContent(elm, '')
      addVnodes(elm, ch, 0, ch.length - 1)
    } else if (oldCh) {
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (oldVnode.text) {
      _node_ops__WEBPACK_IMPORTED_MODULE_0__.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    _node_ops__WEBPACK_IMPORTED_MODULE_0__.setTextContent(elm, vnode.text)
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
      _node_ops__WEBPACK_IMPORTED_MODULE_0__.insertBefore(
        parentElm,
        oldStartVnode.elm,
        _node_ops__WEBPACK_IMPORTED_MODULE_0__.nextSibling(oldEndVnode.elm)
      )
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      _node_ops__WEBPACK_IMPORTED_MODULE_0__.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      //  如果以上都没匹配到，就根据新的key 从老的节点里 把它找出来，然后挪到 oldStartIdx 的位置，并清空
      let idxInOld
      for (let i = oldStartIdx; i <= oldEndIdx; ++i) {
        if (oldCh[i] && newStartVnode.key == oldCh[i].key) {
          idxInOld = i
          break
        }
      }
      if (!idxInOld) {
        createElm(newStartVnode, parentElm, oldStartVnode.elm)
      } else {
        let vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode)
          oldCh[idxInOld] = undefined
          _node_ops__WEBPACK_IMPORTED_MODULE_0__.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          createElm(newStartVnode, parentElm, oldStartVnode.elm)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (oldStartIdx > oldEndIdx) {
    refElm = !newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}

function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm, refElm)
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
  const parent = _node_ops__WEBPACK_IMPORTED_MODULE_0__.parentNode(el)
  if (parent) {
    _node_ops__WEBPACK_IMPORTED_MODULE_0__.removeChild(parent, el)
  }
}

function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag
}


/***/ }),

/***/ "./vue.js":
/*!****************!*\
  !*** ./vue.js ***!
  \****************/
/*! namespace exports */
/*! export default [provided] [used in main] [usage prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watcher */ "./watcher.js");
/* harmony import */ var _compiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compiler */ "./compiler.js");
/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./init */ "./init.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./render */ "./render.js");
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./vdom */ "./vdom.js");






function Vue(options) {
  this._watcher = null
  this._watchers = []
  this._init(options)
}

Vue.prototype.$forceUpdate = function () {
  const vm = this
  if (vm._watcher) {
    vm._watcher.update()
  }
}

Vue.prototype._init = function (options) {
  this.$options = options
  const vm = this
  ;(0,_render__WEBPACK_IMPORTED_MODULE_3__.initRender)(vm) // $slots, $scopedSlots, _c, $createElement, $attrs, $listeners
  // callHook(vm, 'beforeCreate')
  ;(0,_init__WEBPACK_IMPORTED_MODULE_2__.initState)(vm)
  // callHook(vm, 'created')
  this.$mount(options.el)
}

Vue.prototype.$mount = function (el) {
  el = document.querySelector(el)
  this.$options.render = (0,_compiler__WEBPACK_IMPORTED_MODULE_1__.compileToFunctions)(el.outerHTML)
  return this.mountComponent(this, el)
}

Vue.prototype.mountComponent = function (vm, el) {
  this.$el = el
  // callHook(vm, 'beforeMount')
  let updateComponent = function () {
    vm._update(vm._render())
  }
  new _watcher__WEBPACK_IMPORTED_MODULE_0__.default(vm, updateComponent, noop, {}, true)

  // Watcher的第二个参数如果是function 会被立即执行，所以立即_update 立即 patch，patch就是直接操作dom了
  // callHook(vm, 'mounted')
}

Vue.prototype._render = function () {
  console.log('render: get vnode')
  const vm = this
  const vnode = vm.$options.render.call(vm, vm.$createElement)
  return vnode
}

let prevVnode
Vue.prototype._update = function (vnode) {
  console.log('update: vnode => dom', vnode)
  const vm = this

  if (!prevVnode) {
    // initial render
    vm.$el = (0,_vdom__WEBPACK_IMPORTED_MODULE_4__.patch)(vm.$el, vnode)
  } else {
    // updates
    vm.$el = (0,_vdom__WEBPACK_IMPORTED_MODULE_4__.patch)(prevVnode, vnode)
  }

  prevVnode = vnode
}

function noop() {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vue);


/***/ }),

/***/ "./watcher.js":
/*!********************!*\
  !*** ./watcher.js ***!
  \********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ "./dep.js");


let uid = 0
class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    this.cb = cb
    this.id = ++uid
    this.deps = []
    this.depIds = new Set()
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = () => {
        return vm[expOrFn]
      }
    }

    this.value = this.get()
  }

  get() {
    (0,_dep__WEBPACK_IMPORTED_MODULE_0__.pushTarget)(this)
    let value = this.getter.call(this.vm, this.vm)
    ;(0,_dep__WEBPACK_IMPORTED_MODULE_0__.popTarget)(this)
    return value
  }

  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      dep.addSub(this)
      this.depIds.add(dep.id)
    }
  }

  update() {
    this.run()
  }
  run() {
    const value = this.get()
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value

      this.cb.call(this.vm, value, oldValue)
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Watcher);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./vue.js");
/******/ })()
.default;
});
//# sourceMappingURL=vue.js.map