// import React from 'react' // React v17 不再需要引入
// import ReactDOM from 'react-dom'

import { Component } from './react'
import ReactDOM from './react-dom'

function FunctionComp({ name }) {
  return <div>{name}</div>
}

class ClassComp extends Component {
  render() {
    const { name } = this.props
    return <div>{name}</div>
  }
}

const jsx = (
  <div>
    <h3>react try</h3>
    <div>
      <a href="https://github.com/iPeng6/source-practice/tree/main/react-try">
        github react-try source
      </a>
    </div>
    <>
      <p>a</p>
      <p>b</p>
    </>
    {[1, 2, 3].map((item) => {
      return <div key={item}>{item}</div>
    })}
    <FunctionComp name="func comp"></FunctionComp>
    <ClassComp name="class comp"></ClassComp>
  </div>
)

console.log(jsx)

ReactDOM.render(jsx, document.getElementById('root'))
