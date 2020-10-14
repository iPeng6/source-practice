import Dep, { pushTarget, popTarget } from './dep'

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
    pushTarget(this)
    let value = this.getter.call(this.vm, this.vm)
    popTarget(this)
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

export default Watcher
