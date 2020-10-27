import React, { Component } from 'react'
import FieldContext from './FieldContext'
import AsyncValidator from 'async-validator'

class Field extends Component {
  static contextType = FieldContext
  errors = []
  constructor(props) {
    super(props)
    const { registerField } = props.fieldContext
    registerField(this)
  }
  componentDidMount() {
    this.mounted = true
  }
  validateRule = async () => {
    const { name, rules } = this.props
    const value = this.getValue()
    let result = []
    if (rules) {
      const validator = new AsyncValidator({
        [name]: rules,
      })
      this.errors = []
      try {
        await validator.validate({ [name]: value })
      } catch (errObj) {
        result = errObj.errors.map(({ message }) => message)
        this.errors = result
      }
    }
    this.reRender()
    return result
  }
  getValue = () => {
    const { getFieldValue } = this.props.fieldContext
    return getFieldValue(this.props.name)
  }
  onChange = (e) => {
    const { name } = this.props
    const { dispatch } = this.props.fieldContext
    dispatch({ type: 'updateValue', name, value: e.target.value })
  }
  onStoreChange = () => {
    this.reRender()
  }
  reRender = () => {
    if (!this.mounted) return
    this.forceUpdate()
  }
  render() {
    const { children } = this.props
    const value = this.getValue()
    console.log('Field', value, this.errors)
    if (typeof children === 'function') {
      return children(value, this.errors, this.onChange)
    }
    return React.isValidElement(children)
      ? React.cloneElement(children, { value, onChange: this.onChange })
      : null
  }
}

function WrapperField({ name, ...restProps }) {
  const fieldContext = React.useContext(FieldContext)
  return <Field name={name} {...restProps} fieldContext={fieldContext}></Field>
}

export default WrapperField
