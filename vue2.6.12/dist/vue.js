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
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compileToFunctions": () => /* binding */ compileToFunctions
/* harmony export */ });
function compileToFunctions(template) {
  // 编译模板
  console.log('compileToFunctions')

  // 1. parse => ast
  const ast = parse(template.trim())
  // 2. ast => generate => code
  const code = generate(ast)
  return new Function(`
    with (this) {
      return _c('div', { attrs: { id: 'app' } }, [
        _c('button', { on: { click: add } }, [_v(_s(count))]),
      ])
    }
  `)
}

function parse() {}

function generate(ast) {}


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
class Dep {
  constructor() {
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
          if (Array.isArray(value)) {
            value.forEach((item) => {
              observe(item)
            })
          }
        }
      }
      return val
    },
    set(newVal) {
      console.log('set', key, val)
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
    // 源码定义了 isReservedTag 在 src/platforms/web/util/element.js
    if (['div,button,span'].includes(tag)) {
      vnode = new _vdom__WEBPACK_IMPORTED_MODULE_0__.default(tag, data, children, undefined, context)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new _vdom__WEBPACK_IMPORTED_MODULE_0__.default(tag, data, children, undefined, context)
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
}

function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) ||
      Object.prototype.toString.call(val).slice(8, -1) === 'Object'
    ? JSON.stringify(val, null, 2)
    : String(val)
}


/***/ }),

/***/ "./vdom.js":
/*!*****************!*\
  !*** ./vdom.js ***!
  \*****************/
/*! namespace exports */
/*! export createTextVNode [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ VNode,
/* harmony export */   "createTextVNode": () => /* binding */ createTextVNode
/* harmony export */ });
class VNode {
  constructor(tag, data, children, text, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.context = context
  }
}

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
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
/* harmony import */ var _compiler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./compiler */ "./compiler.js");
/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./init */ "./init.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render */ "./render.js");





function Vue(options) {
  this._watcher = null
  this._watchers = []
  this._init(options)
}
Vue.prototype._init = function (options) {
  this.$options = options
  const vm = this
  ;(0,_render__WEBPACK_IMPORTED_MODULE_2__.initRender)(vm) // $slots, $scopedSlots, _c, $createElement, $attrs, $listeners
  // callHook(vm, 'beforeCreate')
  ;(0,_init__WEBPACK_IMPORTED_MODULE_1__.initState)(vm)
  // callHook(vm, 'created')
  this.$mount(options.el)
}

Vue.prototype.$mount = function (el) {
  el = document.querySelector(el)
  this.$options.render = (0,_compiler__WEBPACK_IMPORTED_MODULE_3__.compileToFunctions)(el.outerHTML)
  return this.mountComponent(this, el)
}

Vue.prototype.mountComponent = function (vm, el) {
  this.$el = el
  // callHook(vm, 'beforeMount')
  let updateComponent = function () {
    vm._update(vm._render())
  }
  new _watcher__WEBPACK_IMPORTED_MODULE_0__.default(vm, updateComponent, noop, {}, true)

  // callHook(vm, 'mounted')
}

Vue.prototype._render = function () {
  console.log('render: get vnode')
  const vm = this
  const vnode = vm.$options.render.call(vm, vm.$createElement)
  return vnode
}

Vue.prototype._update = function (vnode) {
  console.log('update: vnode => dom', vnode)
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
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    }

    this.value = this.get()
  }

  get() {
    (0,_dep__WEBPACK_IMPORTED_MODULE_0__.pushTarget)(this)
    let value = this.getter.call(this.vm, this.vm)
    ;(0,_dep__WEBPACK_IMPORTED_MODULE_0__.popTarget)(this)
  }

  addDep(dep) {
    dep.addSub(this)
  }

  update() {
    this.cb.call(vm)
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