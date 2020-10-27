import React from 'react'
import Field from './Field'

export default function FormItem({
  name,
  label,
  rules,
  children,
  ...restProps
}) {
  return (
    <Field name={name} rules={rules}>
      {(value, errors, onChange) => (
        <div>
          <span>{label}</span>
          {React.isValidElement(children)
            ? React.cloneElement(children, { value, errors, onChange })
            : null}
        </div>
      )}
    </Field>
  )
}
