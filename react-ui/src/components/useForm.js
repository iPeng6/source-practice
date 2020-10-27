import * as React from 'react'

export class FormStore {
  store = {}
  forceRootUpdate

  fieldEntities = []

  constructor(forceRootUpdate) {
    this.forceRootUpdate = forceRootUpdate
  }
  getForm = () => {
    return {
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      getFieldsError: this.getFieldsError,
      dispatch: this.dispatch,
      updateValue: this.updateValue,
      registerField: this.registerField,
    }
  }

  getFieldsValue = () => {
    return this.store
  }

  getFieldValue = (name) => {
    return this.store[name]
  }
  getFieldsError = (nameList) => {
    return [
      {
        name: '',
        errors: [],
      },
    ]
  }
  updateValue = (name, value) => {
    this.store = {
      ...this.store,
      [name]: value,
    }
    this.notifyObservers()
  }
  notifyObservers = () => {
    this.fieldEntities.forEach(({ onStoreChange }) => {
      onStoreChange()
    })
    // this.forceRootUpdate()
  }
  registerField = (entity) => {
    this.fieldEntities.push(entity)

    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity)
    }
  }
  validateFields = () => {
    //
  }
  dispatch = (action) => {
    switch (action.type) {
      case 'updateValue': {
        const { name, value } = action
        this.updateValue(name, value)
        break
      }
      case 'validateField': {
        const { name } = action
        this.validateFields([name])
        break
      }
      default:
    }
  }
  submit = () => {
    console.log('submit')
  }
}

function useForm(form) {
  const formRef = React.useRef()
  const [, forceUpdate] = React.useState({})
  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      const forceReRender = () => {
        forceUpdate({})
      }

      const formStore = new FormStore(forceReRender)

      formRef.current = formStore.getForm()
    }
  }

  return [formRef.current]
}

export default useForm
