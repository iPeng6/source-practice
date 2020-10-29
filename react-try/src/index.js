// import React from 'react' // React v17 不再需要引入
import ReactDOM from 'react-dom'

// import ReactDOM from './react-dom'

const jsx = (
  <div>
    <h3>react demo</h3>
    <div>
      <a href="https://github.com/iPeng6">github</a>
    </div>
    <>
      <p>a</p>
      <p>b</p>
    </>
    {[1, 2, 3].map((item) => {
      return <div key={item}>{item}</div>
    })}
  </div>
)

console.log(jsx)

ReactDOM.render(jsx, document.getElementById('root'))
