# 要点笔记

## jsx

```js
const jsx = (
  <div>
    <h3>react demo</h3>
    <div>
      <a href="https://github.com/iPeng6">github</a>
    </div>
  </div>
)
```

babel 转译

```js
const jsx = React.createElement(
  "div",
  null,
  React.createElement("h3", null, "react demo"),
  React.createElement(
    "div",
    null,
    React.createElement("a", { href: "https://github.com/iPeng6" }, "github")
  )
);
```



React 17 在 React 的 package 中引入了两个新入口，这些入口只会被 Babel 和 TypeScript 等编译器使用。新的 JSX 转换**不会将 JSX 转换为 `React.createElement`**，而是自动从 React 的 package 中引入新的入口函数并调用。

```js
const jsx = /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxDEV"])("div", {
  children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxDEV"])("h3", {
    children: "react demo"
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 8,
    columnNumber: 5
  }, undefined)
}, void 0, false, {
  fileName: _jsxFileName,
  lineNumber: 7,
  columnNumber: 3
}, undefined);
```

找下新的入口

```js
var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
```

`./node_modules/react/jsx-dev-runtime.js`

```js
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-jsx-dev-runtime.production.min.js');
} else {
  module.exports = require('./cjs/react-jsx-dev-runtime.development.js');
}
```

`./cjs/react-jsx-dev-runtime.development.js`找到`__["jsxDEV"]`引用

```js
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  return element;
};

function jsxDEV(type, config, maybeKey, source, self) {
  {
    // key, defaultProps 处理

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
}

function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  {
    var validType = isValidElementType(type);

    if (!validType) {
      // ... 无效类型 收集报错提示信息
      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // 创建vnode

    if (element == null) {
      return element;
    }

    // validateChildKeys
    // validateFragmentProps
    // validatePropTypes

    return element;
  }
}

var jsxDEV$1 =  jsxWithValidation ;

exports.jsxDEV = jsxDEV$1;
```

没有看到 children 的处理，入参props已经有了children，说明babel编译时已经将children作为props处理了



## vnode  => dom

```js
function render(vnode, dom) {
  console.log(vnode)
  const { type, props } = vnode

  let el

  if (type === 'TEXT') {
    el = document.createTextNode(props.nodeValue)
  } else if (typeof type === 'symbol' || !type) {
    el = document.createDocumentFragment()
  } else if (typeof type === 'function') {
    if (type.isClassComponent) {
      const cVnode = new type(props).render()
      render(cVnode, dom)
    } else {
      const fVnode = type(props)
      render(fVnode, dom)
    }
    return
  } else {
    el = document.createElement(type)
    updateProps(el, props)
  }

  if (Array.isArray(vnode)) {
    updateChildren(vnode, el)
  } else {
    updateChildren(props.children, el)
  }

  dom.appendChild(el)
}
```

1. 文本节点
2. fragment (type: Symbol(react.fragment))
   1. fragment 标签
   2. map数组返回 也是 fragment
3. function
   1. class本质上也是个function，vnode在实例render里
   2. 函数组件

4. 常规元素

5. vnode 本身可能是数组 如 map返回 没有type props
6. children
   1. 数组
   2. 对象 单个节点
   3. string 文本
