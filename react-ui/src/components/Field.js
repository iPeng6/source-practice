import React, { Component } from 'react'
import FieldContext from './FieldContext'

class Field extends Component {
  static contextType = FieldContext
  constructor(props) {
    super(props)
    const { registerField } = props.fieldContext
    registerField(this)
  }
  componentDidMount() {
    this.mounted = true
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
    console.log('Field', value)
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
