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
  function handleSubmit(e: any) {
    e.preventDefault()
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const _val = {
          ...values,
          price: parseFloat(values.price) || 0,
          amount: parseInt(values.amount) || 0,
        }
        product ? callback({ ...product, ..._val }) : callback(_val)
      }
    })
  }

  const regexPrice = /(^\d+\.?\d{0,2}$|^$)/
  const regexNumeric = /(^\d+$|^$)/

  const { getFieldDecorator } = form
  const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
    },
    wrapperCol: {
      sm: { span: 10 },
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

  return (
    <Card title={product ? 'Edit Product' : 'Add Product'} bordered={false}>
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
        <Form.Item label="Product Description">
          {getFieldDecorator('description', {
            initialValue: product ? product.description : '',
            rules: [
              {
                required: true,
                message: 'Please input a product description',
              },
            ],
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
        <Form.Item label="Price">
          {getFieldDecorator('price', {
            initialValue: product ? product.price : '',
            rules: [
              {
                required: true,
                message: 'Please input a product price',
              },
            ],
            getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
              return regexPrice.test(e.currentTarget.value)
                ? e.currentTarget.value
                : form.getFieldValue('price')
            },
          })(<Input placeholder="Input a number" />)}
        </Form.Item>
        <Form.Item label="Available Amount">
          {getFieldDecorator('amount', {
            initialValue: product ? product.amount : '',
            rules: [
              {
                required: true,
                message: 'Please input a product available amount',
              },
            ],
            getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
              return regexNumeric.test(e.currentTarget.value)
                ? e.currentTarget.value
                : form.getFieldValue('amount')
            },
          })(<Input placeholder="Input a number" />)}
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
