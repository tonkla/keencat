import React from 'react'
import { Button, Form, Input, Select } from 'antd'

import { Page, Shop } from '../../typings'

interface FormProps {
  form: any
  callback: any
  cancel: any
  pages: Page[]
  shop?: Shop
}

const ShopForm = ({ form, callback, cancel, pages, shop }: FormProps) => {
  const { getFieldDecorator } = form
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
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        shop ? callback({ ...shop, name: values.name }) : callback(values)
      }
    })
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="Shop Name">
        {getFieldDecorator('name', {
          initialValue: shop ? shop.name : '',
          rules: [
            {
              required: true,
              message: 'Please input a shop name',
            },
          ],
        })(<Input />)}
      </Form.Item>
      {!shop && (
        <Form.Item label="Facebook Page">
          {getFieldDecorator('pageId', {
            rules: [
              {
                required: true,
                message: 'Please choose a Facebook page',
              },
            ],
          })(
            <Select placeholder="Choose Page" optionFilterProp="children">
              {pages.map((page: Page) => (
                <Select.Option key={page.id} value={page.id}>
                  {page.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      )}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {shop ? 'Edit' : 'Create'}
        </Button>
        <div className="btn-cancel">
          <span className="link" onClick={cancel}>
            Cancel
          </span>
        </div>
      </Form.Item>
    </Form>
  )
}

const _this: any = Form.create({ name: 'shopForm' })(ShopForm)
export default _this
