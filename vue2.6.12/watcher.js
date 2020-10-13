import Dep, { pushTarget, popTarget } from './dep'

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
    pushTarget(this)
    let value = this.getter.call(this.vm, this.vm)
    popTarget(this)
  }

  addDep(dep) {
    dep.addSub(this)
  }

  update() {
    this.cb.call(vm)
  }
}

export default Watcher
