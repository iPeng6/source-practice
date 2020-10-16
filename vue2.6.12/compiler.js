// import { parse } from './vue-srouce/src/compiler/parser'
// import { generate } from './vue-srouce/src/compiler/codegen/index'

export function compileToFunctions(template) {
  // 编译模板
  console.log('compileToFunctions')

  // 1. parse => ast
  const ast = parse(template.trim())
  console.log('ast', ast)
  // 2. ast => generate => code
  const code = generate(ast)

  return new Function(code.render)
}

export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签 '<div'
const startTagClose = /^\s*(\/?)>/ // 匹配结束标签 ' >' ' />'
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

function parse(html) {
  const stack = []
  let index = 0
  let last
  while (html) {
    last = html
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 结束标签
      // End tag:
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        stack.pop()
        currentParent = stack[stack.length - 1]
        continue
      }
      // 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
        continue
      }
    }
    let text, rest, next
    if (textEnd >= 0) {
      rest = html.slice(textEnd)
      while (!endTag.test(rest) && !startTagOpen.test(rest)) {
        // < in plain text, be forgiving and treat it as text
        next = rest.indexOf('<', 1)
        if (next < 0) break
        textEnd += next
        rest = html.slice(textEnd)
      }
      text = html.substring(0, textEnd) // 获得标签内容
    }
    if (textEnd < 0) {
      text = html
    }

    if (text) {
      advance(text.length)
      if (currentParent && text.trim()) {
        const res = parseText(text)
        let child
        if (res) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text,
          }
        } else {
          child = {
            type: 3,
            text,
          }
        }
        currentParent.children.push(child)
      }
    }

    if (html === last) {
      break
    }
  }

  function advance(n) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  function handleStartTag(match) {
    const tagName = match.tagName

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''

      attrs[i] = {
        name: args[1],
        value,
      }
    }

    // createASTElement
    let element = createASTElement(tagName, attrs, currentParent)
    stack.push(element)
    if (currentParent) {
      currentParent.children.push(element)
      currentParent = element
    }

    if (!root) {
      root = currentParent = element
    }

    processAttrs(element)
  }

  return root
}

let root // 用于最后返回整棵树
let currentParent // 用于构建ast树

function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: [],
  }
}

function makeAttrsMap(attrs) {
  const map = new Map()
  attrs.forEach(({ name, value }) => {
    map.set(name, value)
  })

  return map
}
const onRE = /^@|^v-on:/
function processAttrs(el) {
  let events
  el.attrsList.forEach((attr) => {
    let { name, value } = attr
    // v-on
    if (onRE.test(name)) {
      name = name.replace(onRE, '')
      if (!events) events = {}
      events[name] = {
        value,
      }
    }
    //v-for
    if (name === 'v-for') {
      const [alias, forItems] = value.split(' in ')
      el.alias = alias
      el.for = forItems
    }
    if (name === ':key') {
      el.key = value
    }
  })
  if (events) {
    el.events = events
  }
}

const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function parseText(text) {
  if (!tagRE.test(text)) {
    return
  }
  const tokens = []
  const rawTokens = []
  let lastIndex = (tagRE.lastIndex = 0)
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      rawTokens.push((tokenValue = text.slice(lastIndex, index)))
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = match[1].trim()
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push((tokenValue = text.slice(lastIndex)))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens,
  }
}
function generate(ast) {
  const code = ast ? genElement(ast) : '_c("div")'
  console.log(code)
  return {
    render: `with(this){return ${code}}`,
  }
}

function genElement(ast) {
  if (ast.for && !ast.forProcessed) {
    return genFor(ast)
  }
  return `_c('${ast.tag}', ${genData(ast)}, ${getChildren(ast)})`
}

function getChildren(ast) {
  if (!ast) return ''

  return `[${ast.children
    .map((child) => {
      if (child.type === 1) {
        return genElement(child)
      } else {
        return genText(child)
      }
    })
    .join(',')}]`
}

function genText(text) {
  return `_v(${text.type === 2 ? text.expression : JSON.stringify(text.text)})`
}

function genData(ast) {
  let data = '{'

  const attrs = ast.attrsList
    .filter((attr) => {
      if (attr.name === ':key') return false
      if (attr.name.startsWith('v-')) return false
      if (ast.events && ast.attrsMap.has(attr.name)) {
        return false
      }
      return true
    })
    .map((attr) => `${attr.name}: '${attr.value}'`)
    .join(',')

  if (ast.key) {
    data += `key:${ast.key},`
  }
  if (attrs !== '') {
    data += `attrs:{${attrs}},`
  }
  if (ast.events) {
    data += `on:{${Object.keys(ast.events)
      .map((ev) => `${ev}:${ast.events[ev].value}`)
      .join(',')}}`
  }
  data += '}'
  return data
}

function genFor(el) {
  const exp = el.for
  const alias = el.alias

  el.forProcessed = true // 避免死循环
  return (
    `_l((${exp}),` + `function(${alias}){` + `return ${genElement(el)}` + '})'
  )
}
