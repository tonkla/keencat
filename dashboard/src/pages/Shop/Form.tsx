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
  function handleSubmit(e: any) {
    e.preventDefault()
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        shop ? callback({ ...shop, ...values }) : callback(values)
      }
    })
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

  const { getFieldDecorator } = form
  const { Option } = Select
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
                <Option key={page.id} value={page.id}>
                  {page.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      )}
      <Form.Item label="Phone Number">
        {getFieldDecorator('phoneNumber', {
          initialValue: shop ? shop.phoneNumber : '',
          getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
            return regexNumeric.test(e.currentTarget.value)
              ? e.currentTarget.value
              : form.getFieldValue('phoneNumber')
          },
        })(<Input placeholder="Input a number" />)}
      </Form.Item>
      <Form.Item label="PromptPay ID">
        {getFieldDecorator('promptPay', {
          initialValue: shop ? shop.promptPay : '',
          getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
            return regexNumeric.test(e.currentTarget.value)
              ? e.currentTarget.value
              : form.getFieldValue('promptPay')
          },
        })(<Input placeholder="Input a number" />)}
      </Form.Item>
      <Form.Item label="Bank">
        {getFieldDecorator('bank', {
          initialValue: shop ? shop.bank : '',
        })(
          <Select style={{ width: 200 }}>
            {banks.map(bank => (
              <Option key={bank.code} value={bank.name}>
                {bank.name}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Bank Account Number">
        {getFieldDecorator('bankAccountNumber', {
          initialValue: shop ? shop.bankAccountNumber : '',
          getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
            return regexNumeric.test(e.currentTarget.value)
              ? e.currentTarget.value
              : form.getFieldValue('bankAccountNumber')
          },
        })(<Input placeholder="Input a number" />)}
      </Form.Item>
      <Form.Item label="Bank Account Name">
        {getFieldDecorator('bankAccountName', {
          initialValue: shop ? shop.bankAccountName : '',
        })(<Input />)}
      </Form.Item>
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
