import Dep from './dep'

export class Observor {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
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

export function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observor(value)
}

function defineReactive(obj, key) {
  const dep = new Dep()
  let val = obj[key]
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key, val)
      if (Dep.target) {
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
