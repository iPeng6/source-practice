import React, { useMemo } from 'react'
import useForm from './useForm'
import FieldContext from './FieldContext'

export default function Form({ form, onFinish, children, ...restProps }) {
  const [formInstance] = useForm(form)
  const formContextValue = useMemo(() => {
    return {
      ...formInstance,
    }
  }, [formInstance])

  const { setCallbacks } = formInstance
  setCallbacks({
    onFinish,
  })
  console.log('form')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()

        formInstance.submit()
      }}
    >
      <FieldContext.Provider value={formContextValue}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}
