const fs = require('fs')
const path = require('path')
const vm = require('vm')

function customRequire(modulePath) {
  const filePath = path.resolve(__dirname, modulePath)
  const code = fs.readFileSync(filePath, 'utf-8')
  const wraperFunc = `
  (function(require, module, exports){
    ${code}
  })
  `

  const script = new vm.Script(wraperFunc)
  const func = script.runInThisContext()
  const m = { exports: {} }
  func(customRequire, m, m.exports)
  return m.exports
}

const requireResult = customRequire('./module.js')

console.log(requireResult)
