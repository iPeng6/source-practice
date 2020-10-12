function Vue(options) {
  // 初始化
  this.$data = options.data()

  // 挂载数据方法
  this.proxyData(this.$data)
  this.proxyMethods(options.methods)

  // 响应式处理
  Observer.create(this.$data, this)

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

Observer.create = function (obj, vm) {
  if (!obj || typeof obj !== 'object') return
  new Observer(obj)
}

function defineReactive(obj, key, val) {
  const dep = new Dep()
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
    if (attrName.startsWith('v-')) {
      const dir = attrName.substring(2)
      this.directives[dir](node, exp, this.vm)
    } else if (attrName.startsWith('@')) {
      const event = attrName.substring(1)
      node.addEventListener(event, this.vm[exp])
    }
  })
}
Compile.prototype.compileTextNode = function (node) {
  console.log('编译插值文本' + node.data)
  const content = node.data
  if (/\{\{(\w*)\}\}/i.test(node.data)) {
    const updateFn = () => {
      node.textContent = content.replace(/\{\{(\w*)\}\}/gi, (sv, rv) => {
        return this.vm[rv]
      })
    }
    const matches = node.data.matchAll(/\{\{(\w*)\}\}/g)
    for (const match of matches) {
      const exp = match[1]
      const watcher = new Watcher(this.vm, exp, updateFn)
      watcher.update()
    }
  }
}

Compile.prototype.directives = {
  model(node, exp, vm) {
    node.value = vm[exp]
    node.addEventListener('input', (e) => {
      vm[exp] = e.target.value
    })
  },
}
