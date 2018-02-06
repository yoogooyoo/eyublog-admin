import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select } from 'antd'

import Ueditor from '../ueditor'

class GatherDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gather: {},
      content: ''
    }
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    let id = this.props.id

    if (id !== null) {
      fetch(`/gather/${id}`, {
        credentials: 'include'
      }).then((res) => {
        if (res.status !== 200) {
          throw new Error('Load Failed, Status: ' + res.status)
        }
        res.json().then((data) => {
          if (data.status === 0) {
            this.setState({error: data.message})
          } else {
            this.setState({gather: data.info})
          }
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  handleChange = (content) => {
    this.state.content = content
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      let {content = ''} = this.state
      if (content.trim() === '') {
        alert('收藏内容为空')
        return
      }

      values.id = this.props.id
      values.content = content

      fetch('/gather-submit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(values)
      }).then((res) => {
        if (res.status !== 200) {
          throw new Error('Load Failed, Status: ' + res.status)
        }
        res.json().then((data) => {
          if (data.status === 0) {
            this.setState({error: data.message})
          }
          else {
            alert('收藏提交成功')
            this.context.router.push(`/gather`)
          }
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        console.log(error)
      })
    })
  }

  render() {
    let {title, tag, detail} = this.state.gather
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    const tagError = isFieldTouched('tag') && getFieldError('tag')
    const titleError = isFieldTouched('title') && getFieldError('title')

    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''} label="标题">
            {
              getFieldDecorator('title', {
                initialValue: title,
                rules: [{required: true, message: 'Please input title'}]
              })(
                <Input placeholder="title" style={{width: 400}} />
              )
            }
          </Form.Item>
          <Form.Item validateStatus={tagError ? 'error' : ''} help={tagError || ''} label="标签">
            {
              getFieldDecorator('tag', {
                initialValue: tag,
                rules: [{required: true, message: 'Please input tag'}]
              })(
                <input placeholder="tag" style={{width: 250}} />
              )
            }
          </Form.Item>
          <Ueditor content={detail} onChange={this.handleChange} />
          <div style={{textAlign: "right"}}>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedGatherDetail = Form.create()(GatherDetail)

export default WrappedGatherDetail