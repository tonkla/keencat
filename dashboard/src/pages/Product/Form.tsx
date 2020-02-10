import React from 'react'
import { Button, Card, Form, Input } from 'antd'

import { Product } from '../../typings'

interface FormProps {
  form: any
  callback: any
  cancel: any
  product?: Product
}

const ProductForm = ({ form, callback, cancel, product }: FormProps) => {
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
        product ? callback({ ...product, name: values.name }) : callback(values)
      }
    })
  }

  const formTitle = product ? 'Edit Product' : 'Add Product'

  return (
    <Card title={formTitle} bordered={false}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Product Name">
          {getFieldDecorator('name', {
            initialValue: product ? product.name : '',
            rules: [
              {
                required: true,
                message: 'Please input a product name',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {product ? 'Edit' : 'Add'}
          </Button>
          <div className="btn-cancel">
            <span className="link" onClick={cancel}>
              Cancel
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  )
}

const _this: any = Form.create({ name: 'productForm' })(ProductForm)
export default _this
