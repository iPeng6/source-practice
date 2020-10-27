import * as React from 'react'
const FormContext = React.createContext({
  triggerFormChange: () => {},
  triggerFormFinish: () => {},
})

const FormProvider = ({ onFormChange, onFormFinish, children }) => {
  const formContext = React.useContext(FormContext)
  const formsRef = React.useRef({})

  return (
    <FormContext.Provider
      value={{
        ...formContext,
        triggerFormChange: (name, changedFields) => {
          if (onFormChange) {
            onFormChange(name, {
              changedFields,
              forms: formsRef.current,
            })
          }

          formContext.triggerFormChange(name, changedFields)
        },
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export { FormProvider }

export default FormContext
