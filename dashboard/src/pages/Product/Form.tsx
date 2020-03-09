import React from 'react'
import { Button, Card, Form, Input, Radio } from 'antd'

import { Product } from '../../typings'

interface FormProps {
  callback: any
  cancel: any
  product?: Product
}

const ProductForm = ({ callback, cancel, product }: FormProps) => {
  function onFinish(values: any) {
    const _val = {
      ...values,
      price: parseFloat(values.price) || 0,
      quantity: parseInt(values.quantity) || 0,
    }
    product ? callback({ ...product, ..._val }) : callback(_val)
  }

  const regexPrice = /(^\d+\.?\d{0,2}$|^$)/
  const regexNumeric = /(^\d+$|^$)/

  const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 8 } }
  const tailLayout = { wrapperCol: { offset: 4, span: 8 } }

  return (
    <Card title={product ? 'Edit Product' : 'Add Product'} bordered={false}>
      <Form
        {...formLayout}
        initialValues={{
          type: product ? product.type : 'goods',
          name: product ? product.name : '',
          description: product ? product.description : '',
          price: product ? product.price : '',
          quantity: product ? product.quantity : '',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Type is required' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="goods">Goods</Radio.Button>
            <Radio.Button value="service">Service</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: 'Price is required' },
            {
              validator: async (rule, value) => {
                return regexPrice.test(value)
                  ? Promise.resolve()
                  : Promise.reject('Price format is incorrect')
              },
            },
          ]}
        >
          <Input placeholder="Input a number" />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { required: true, message: 'Quantity is required' },
            {
              validator: async (rule, value) => {
                return regexNumeric.test(value)
                  ? Promise.resolve()
                  : Promise.reject('Only number is accepted')
              },
            },
          ]}
        >
          <Input placeholder="Input a number" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {product ? 'Edit' : 'Add'}
          </Button>
          <Button type="link" onClick={cancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ProductForm
