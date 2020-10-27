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
  console.log('form')
  return (
    <FieldContext.Provider value={formContextValue}>
      {children}
    </FieldContext.Provider>
  )
}
