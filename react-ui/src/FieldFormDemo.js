// import Form, { Field } from 'rc-field-form'
// import Input from './Input'
import Input from './components/Input'
import Form from './components/Form'
import Field from './components/Field'

function Demo() {
  return (
    <Form
      onFinish={(values) => {
        console.log('Finish:', values)
      }}
    >
      <Field
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder="Username" />
      </Field>
      <Field name="password">
        <Input placeholder="Password" />
      </Field>

      <button>Submit</button>
    </Form>
  )
}

export default Demo
