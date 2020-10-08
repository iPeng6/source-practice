let Vue

class Store {
  constructor(options) {
    // this.state = options.state
    this.mutations = options.mutations
    this.actions = options.actions
    this.getters = {}

    const computed = {}

    Object.keys(options.getters).forEach((key) => {
      computed[key] = () => {
        return options.getters[key](this.state)
      }

      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
      })
    })

    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
      computed,
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  get state() {
    return this._vm._data.$$state
  }
  commit(type, payload) {
    this.mutations[type](this.state, payload)
  }
  dispatch(type, payload) {
    this.actions[type](this, payload)
  }
}

function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    },
  })
}

export default {
  Store,
  install,
}
