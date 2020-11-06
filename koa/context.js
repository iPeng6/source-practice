const context = {}

module.exports = context

class Delegator {
  constructor(proto, target) {
    this.proto = proto
    this.target = target
  }
  method(name) {
    proto[name] = (...args) => {
      return this[this.target].apply(this[this.target], args)
    }
    return this
  }
  getter(name) {
    // 源码里发现 用了一个已经废弃的方法 __defineGetter__
    // https://github.com/tj/node-delegates/blob/master/index.js
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineGetter__
    Object.defineProperty(this.proto, name, {
      get: () => {
        return this.proto[this.target][name]
      },
    })
    return this
  }
  setter(name) {
    Object.defineProperty(this.proto, name, {
      set: (val) => {
        this.proto[this.target][name] = val
      },
    })
    return this
  }
  accsss(name) {
    Object.defineProperty(this.proto, name, {
      get: () => {
        return this.proto[this.target][name]
      },
      set: (val) => {
        this.proto[this.target][name] = val
      },
    })
    return this
  }
}

// ctx[key] => ctx.request[key]
new Delegator(context, 'request').accsss('url').getter('method')
new Delegator(context, 'response').accsss('body')
