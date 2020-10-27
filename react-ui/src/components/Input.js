import React, { Component } from 'react'

export default class Input extends Component {
  constructor(props) {
    super(props)
    const value =
      typeof props.value === 'undefined' ? props.defaultValue : props.value
    this.state = {
      value,
    }
  }
  static getDerivedStateFromProps(nextProps, { prevValue }) {
    const newState = { prevValue: nextProps.value }
    if (nextProps.value !== undefined || prevValue !== nextProps.value) {
      newState.value = nextProps.value
    }
    return newState
  }

  onChange = (e) => {
    this.setState({ value: e.target.value })
  }
  render() {
    const { prefix, value = '', errors, ...restProps } = this.props
    console.log('input', errors)
    return (
      <span>
        {prefix}
        <input value={value} onChange={this.onChange} {...restProps}></input>
        <div style={{ color: 'red' }}>{errors.join(' ')}</div>
      </span>
    )
  }
}
