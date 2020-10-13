export function compileToFunctions(template) {
  // 编译模板
  console.log('compileToFunctions')

  // 1. parse => ast
  const ast = parse(template.trim())
  // 2. ast => generate => code
  const code = generate(ast)
  return new Function(`
    with (this) {
      return _c('div', { attrs: { id: 'app' } }, [
        _c('button', { on: { click: add } }, [_v(_s(count))]),
      ])
    }
  `)
}

function parse() {}

function generate(ast) {}
