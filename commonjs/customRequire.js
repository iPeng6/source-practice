const fs = require('fs')
const path = require('path')
const vm = require('vm')

function customRequire(modulePath) {
  const filePath = path.resolve(__dirname, modulePath)
  const code = fs.readFileSync(filePath, 'utf-8')
  const wrapperFunc = `
  (function(exports, require, module ){
    ${code}
  })
  `

  const func = vm.runInThisContext(wrapperFunc)
  const m = { exports: {} }
  func(m.exports, customRequire, m)
  return m.exports
}

const requireResult = customRequire('./module.js')

console.log(requireResult)
