import React from 'react'
import { Button, Card, Form, Input } from 'antd'

import { Category } from '../../typings'

interface FormProps {
  callback: any
  cancel: any
  category?: Category
}

const CategoryForm = ({ callback, cancel, category }: FormProps) => {
  const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 8 } }
  const tailLayout = { wrapperCol: { offset: 4, span: 8 } }

  function onFinish(values: any) {
    category ? callback({ ...category, name: values.name }) : callback(values)
  }

  const formTitle = category ? 'Edit Category' : 'Add Category'

  return (
    <Card title={formTitle} bordered={false}>
      <Form
        {...formLayout}
        name="category"
        initialValues={{ name: category ? category.name : '' }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {category ? 'Edit' : 'Add'}
          </Button>
          <Button type="link" onClick={cancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default CategoryForm
