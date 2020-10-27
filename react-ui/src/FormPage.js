import { Button, Form, Input } from 'antd'
import React, { Component } from 'react'
import { UserAddOutlined, LockOutlined } from '@ant-design/icons'

export default class FormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      password: '',
    }
  }
  submit = () => {
    console.log(this.state)
  }
  render() {
    const { name, password } = this.state
    return (
      <div>
        <h3>FormPage</h3>
        <Form>
          <Form.Item label="姓名">
            <Input
              placeholder="请输入姓名"
              prefix={<UserAddOutlined />}
              value={name}
              onChange={(e) => {
                this.setState({ name: e.target.value })
              }}
            ></Input>
          </Form.Item>
          <Form.Item label="密码">
            <Input
              type="password"
              placeholder="请输入密码"
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => {
                this.setState({ password: e.target.value })
              }}
            ></Input>
          </Form.Item>
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </Form>
      </div>
    )
  }
}
