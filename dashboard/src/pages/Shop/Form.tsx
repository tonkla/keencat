import React from 'react'
import { Button, Form, Input, Select } from 'antd'

import { Shop } from '../../typings'
import { FBPage } from '../../typings/facebook'

interface FormProps {
  callback: any
  cancel: any
  pages: FBPage[]
  shop?: Shop
}

const ShopForm = ({ callback, cancel, pages, shop }: FormProps) => {
  function onFinish(values: any) {
    shop ? callback({ ...shop, ...values }) : callback(values)
  }

  const banks = [
    { code: 'BKKBTHBK', name: 'ธนาคารกรุงเทพ' },
    { code: 'KRTHTHBK', name: 'ธนาคารกรุงไทย' },
    { code: 'AYUDTHBK', name: 'ธนาคารกรุงศรีอยุธยา' },
    { code: 'KASITHBK', name: 'ธนาคารกสิกรไทย' },
    { code: 'SICOTHBK', name: 'ธนาคารไทยพาณิชย์' },
    { code: 'TMBKTHBK', name: 'ธนาคารทหารไทย' },
    { code: 'GSBATHBK', name: 'ธนาคารออมสิน' },
  ]

  const regexNumeric = /(^\d+$|^$)/

  const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 8 } }
  const tailLayout = { wrapperCol: { offset: 4, span: 8 } }
  const initialValues = {
    name: shop ? shop.name : '',
    phoneNumber: shop ? shop.phoneNumber : '',
    promptPay: shop ? shop.promptPay : '',
    bank: shop ? shop.bank : '',
    bankAccountNumber: shop ? shop.bankAccountNumber : '',
    bankAccountName: shop ? shop.bankAccountName : '',
  }

  return (
    <Form {...formLayout} initialValues={initialValues} onFinish={onFinish}>
      {!shop && (
        <Form.Item
          label="Facebook Page"
          name="pageId"
          rules={[{ required: true, message: 'Facebook page is required' }]}
        >
          <Select placeholder="Choose Page" optionFilterProp="children">
            {pages.map((page: FBPage) => (
              <Select.Option key={page.id} value={page.id}>
                {page.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Phone number is required' },
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
      <Form.Item
        label="PromptPay ID"
        name="promptPay"
        rules={[
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
      <Form.Item label="Bank" name="bank">
        <Select style={{ width: 200 }}>
          {banks.map(bank => (
            <Select.Option key={bank.code} value={bank.name}>
              {bank.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Account Number"
        name="bankAccountNumber"
        rules={[
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
      <Form.Item label="Account Name" name="bankAccountName">
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {shop ? 'Edit' : 'Create'}
        </Button>
        <Button type="link" onClick={cancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ShopForm
