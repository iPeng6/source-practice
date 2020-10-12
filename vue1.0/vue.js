function Vue(options) {
  // 初始化
  this.$data = options.data()

  // 挂载数据方法
  this.proxyData(this.$data)
  this.proxyMethods(options.methods)

  // 响应式处理
  Observer.create(this.$data)

  // 编译，创建watcher
  if (options.el) {
    this.$mount(options.el)
  }
}

Vue.prototype.proxyData = function (obj) {
  Object.keys(obj).forEach((key) => {
    Object.defineProperty(this, key, {
      get() {
        return obj[key]
      },
      set(newVal) {
        obj[key] = newVal
      },
    })
  })
}

Vue.prototype.proxyMethods = function (obj) {
  Object.keys(obj).forEach((key) => {
    Object.defineProperty(this, key, {
      get() {
        return obj[key].bind(this)
      },
      set(newVal) {
        obj[key] = newVal
      },
    })
  })
}

Vue.prototype.$mount = function (el) {
  this.$el = document.querySelector(el)
  new Compile(this.$el, this)
}

function Observer(obj) {
  this.dep = new Dep()

  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
}

Observer.create = function (obj) {
  if (!obj || typeof obj !== 'object') return
  const ob = new Observer(obj)
  return ob
}

function defineReactive(obj, key, val) {
  const dep = new Dep()
  Observer.create(this.$data)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get:', key, val)
      // 依赖收集
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      console.log('set:', key, newVal, val)
      val = newVal
      dep.notify()
    },
  })
}

function Dep() {
  this.subs = []
}

Dep.target = null // 临时存储将来需要收集的watcher

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

Dep.prototype.depend = function () {
  Dep.target.depend(this)
}

Dep.prototype.notify = function () {
  this.subs.forEach((sub) => {
    sub.update()
  })
}

function Watcher(vm, exp, cb) {
  this.vm = vm
  this.exp = exp
  this.cb = cb

  // 主动get触发依赖收集
  Dep.target = this
  this.value = vm[exp]
  Dep.target = null
}

Watcher.prototype.update = function () {
  this.cb.call(this.vm, this.vm[this.exp])
}

Watcher.prototype.depend = function (dep) {
  dep.addSub(this)
}

function Compile(el, vm) {
  this.vm = vm

  this._compile(el)
}

Compile.prototype._compile = function (el) {
  const childNodes = el.childNodes
  Array.from(childNodes).forEach((node) => {
    if (node.nodeType === 1 && node.tagName !== 'SCRIPT') {
      this.compileElement(node)
    } else if (node.nodeType === 3 && node.data.trim()) {
      this.compileTextNode(node)
    }
    if (node.childNodes && node.childNodes.length > 0) {
      this._compile(node)
    }
  })
}

Compile.prototype.compileElement = function (node) {
  console.log('编译元素' + node.nodeName)
  const attrs = node.attributes
  Array.from(attrs).forEach((attr) => {
    const attrName = attr.name
    const exp = attr.value
    if (attrName.startsWith('v-bind:')) {
      this.directives['bind'](node, exp, attrName, this.vm)
    } else if (attrName.startsWith('@')) {
      this.directives['on'](node, exp, attrName, this.vm)
    } else if (attrName.startsWith('v-')) {
      const dir = attrName.substring(2)
      this.directives[dir](node, exp, attrName, this.vm)
    }
  })
}
Compile.prototype.compileTextNode = function (node) {
  const content = node.data
  if (/\{\{(.*)\}\}/.test(node.data)) {
    console.log('编译插值文本' + node.data)
    this.directives['interp'](node, content, this.vm)
  }
}

Compile.prototype.directives = {
  // 插值
  interp(node, exp, vm) {
    const updateFn = () => {
      node.textContent = exp.replace(/\{\{(\w*)\}\}/gi, (sv, rv) => {
        return vm[rv]
      })
    }
    const matches = node.data.matchAll(/\{\{(\w*)\}\}/g)
    let watcher
    for (const match of matches) {
      const exp = match[1]
      watcher = new Watcher(vm, exp, updateFn)
    }
    // 首次主动触发
    updateFn()
  },
  bind(node, exp, attrName, vm) {
    node.removeAttribute(attrName)
    const attr = attrName.replace('v-bind:', '')
    const watcher = new Watcher(vm, exp, () => {
      node.setAttribute(attr, vm[exp])
    })
    watcher.update()
  },
  on(node, exp, attrName, vm) {
    const event = attrName.substring(1)
    node.addEventListener(event, vm[exp])
  },
  model(node, exp, attrName, vm) {
    node.removeAttribute(attrName)
    node.addEventListener('input', (e) => {
      vm[exp] = e.target.value
    })
    const watcher = new Watcher(vm, exp, () => {
      node.value = vm[exp]
    })
    watcher.update()
  },
}
