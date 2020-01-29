import React from 'react'
import { Button, Form, Input, Select } from 'antd'

import { Page } from '../../typings'

const CreateForm = (props: any) => {
  const { getFieldDecorator } = props.form
  const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
    },
    wrapperCol: {
      sm: { span: 8 },
    },
  }
  const tailFormItemLayout = {
    wrapperCol: {
      sm: {
        span: 8,
        offset: 4,
      },
    },
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        props.callback(values)
      }
    })
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="Shop Name">
        {getFieldDecorator('shopName', {
          rules: [
            {
              required: true,
              message: 'Please input a shop name',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Facebook Page">
        {getFieldDecorator('pageId', {
          rules: [
            {
              required: true,
              message: 'Please choose a page to connected with',
            },
          ],
        })(
          <Select placeholder="Choose Page" optionFilterProp="children">
            {props.pages.map((page: Page) => (
              <Select.Option key={page.id} value={page.id}>
                {page.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

const _this: any = Form.create({ name: 'createShop' })(CreateForm)
export default _this
