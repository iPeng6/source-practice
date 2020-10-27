import { Button, Form, Input } from 'antd'
import React from 'react'
import { UserAddOutlined, LockOutlined } from '@ant-design/icons'
// import Input from './components/Input'

const nameRules = [
  {
    required: true,
    message: 'Please input your username!',
  },
]

const passwordRules = [
  {
    required: true,
    message: 'Please input your password!',
  },
]

const FormPage = () => {
  const onFinish = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div>
      <h3>FormPage</h3>
      {/* <Input placeholder="请输入姓名" prefix={<UserAddOutlined />}></Input> */}
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="姓名" name="name" rules={nameRules}>
          <Input placeholder="请输入姓名" prefix={<UserAddOutlined />}></Input>
        </Form.Item>
        <Form.Item label="密码" name="password" rules={passwordRules}>
          <Input.Password
            placeholder="请输入密码"
            prefix={<LockOutlined />}
          ></Input.Password>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form>
    </div>
  )
}

export default FormPage
