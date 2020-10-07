import RouterLink from './link'
import RouterView from './view'

let _Vue

class VueRouter {
  constructor(options) {
    this.routeMap = new Map()
    options.routes.forEach((route) => {
      this.routeMap.set(route.path, route.component)
    })

    _Vue.util.defineReactive(this, 'current', '/')

    window.addEventListener('hashchange', this.hashchange.bind(this), false)
    window.addEventListener('load', this.hashchange.bind(this), false)
  }
  hashchange() {
    this.current = location.hash.slice(1)
  }
}

function install(Vue) {
  _Vue = Vue

  // 1. 注册$router

  Vue.mixin({
    beforeCreate() {
      // 判断只有根组件才有router实例
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    },
  })

  // 2. 注册组件
  Vue.component('router-link', RouterLink)
  Vue.component('router-view', RouterView)
}

VueRouter.install = install

export default VueRouter
