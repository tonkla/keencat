import React, { useState } from 'react'
import { Button, Card, Form, Input, Radio, TimePicker } from 'antd'
import moment from 'moment'

import { Product, ProductTypeEnum, ProductChargeTypeEnum } from '../../typings'

interface FormProps {
  callback: any
  cancel: any
  product?: Product
}

const ProductForm = ({ callback, cancel, product }: FormProps) => {
  const [productType, setProductType] = useState(product ? product.type : ProductTypeEnum.Goods)
  const [chargeType, setChargeType] = useState(
    product ? product.charge : ProductChargeTypeEnum.Daily
  )

  const timeFormat = 'HH:mm'

  function onFinish(values: any) {
    const _product = product ? { ...product } : null

    const _val = {
      ...values,
      price: parseFloat(values.price) || 0,
    }

    if (values.type === ProductTypeEnum.Goods) {
      _val.quantity = parseInt(values.quantity) || 0
    } else if (_product?.quantity) {
      delete _product.quantity
    }

    if (values.charge === ProductChargeTypeEnum.Hourly) {
      _val.openAt = moment(values.openAt).format(timeFormat)
      _val.closeAt = moment(values.closeAt).format(timeFormat)
    }

    if (_product) {
      if (_product.openAt) delete _product.openAt
      if (_product.closeAt) delete _product.closeAt
      callback({ ..._product, ..._val })
    } else {
      callback(_val)
    }
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
          type: product ? product.type : ProductTypeEnum.Goods,
          name: product ? product.name : '',
          description: product ? product.description : '',
          price: product ? product.price : '',
          quantity: product ? product.quantity : '',
          charge: product ? product.charge : '',
          openAt: product ? (product.openAt ? moment(product.openAt, timeFormat) : '') : '',
          closeAt: product ? (product.closeAt ? moment(product.closeAt, timeFormat) : '') : '',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Type is required' }]}
        >
          <Radio.Group buttonStyle="solid" onChange={e => setProductType(e.target.value)}>
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
        {productType === ProductTypeEnum.Goods ? (
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
        ) : (
          <>
            <Form.Item
              label="Charge"
              name="charge"
              rules={[{ required: true, message: 'Charge type is required' }]}
            >
              <Radio.Group buttonStyle="outline" onChange={e => setChargeType(e.target.value)}>
                <Radio.Button value="hourly">Hourly</Radio.Button>
                <Radio.Button value="daily">Daily</Radio.Button>
                <Radio.Button value="monthly">Monthly</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {chargeType === ProductChargeTypeEnum.Hourly && (
              <>
                <Form.Item
                  label="Open at"
                  name="openAt"
                  rules={[{ required: true, message: 'Opening hour is required' }]}
                >
                  <TimePicker format={timeFormat} />
                </Form.Item>
                <Form.Item
                  label="Close at"
                  name="closeAt"
                  rules={[{ required: true, message: 'Closed hour is required' }]}
                >
                  <TimePicker format={timeFormat} />
                </Form.Item>
              </>
            )}
          </>
        )}
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
