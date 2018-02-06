import md5 from 'md5'
import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'

import './index.scss'

const PropTypes = require('prop-types')

class LoginForm extends Component {
  static contentTypes = {
    router: React.PropTypes.object
  }

  componentDidMount() {
    sessionStorage.user = 0
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      let url = `/toLogin?userid=${values.userid}&password=${md5(values.password)}`
      fetch(url, { credentials : 'include' }).then((res) => {
        if (res.status !== 200) {
          throw new Error('Login failed, status:' + res.status)
        }

        res.json().then((data) => {
          if (data.status === 0) {
            alert(data.message)
          }
          else {
            sessionStorage.user = 1
            this.context.router.push("/home")
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="login-wrap">
        <p className="login-head">Admin Login</p>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {
              getFieldDecorator('userid', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your username'
                  }
                ]
              })(
                <Input prefix={<Icon type="user" />} placeholder="userid" />
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please Input your Password'
                  }
                ]
              })(
                <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />
              )
            }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">Login In</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

LoginForm.contextTypes = {
  router: PropTypes.object
}

const WrappedLoginForm = Form.create()(LoginForm)

export default WrappedLoginForm