import React from 'react'
import { Button, Card, Form, Input } from 'antd'

import { Category } from '../../typings'

interface FormProps {
  form: any
  callback: any
  cancel: any
  category?: Category
}

const CategoryForm = ({ form, callback, cancel, category }: FormProps) => {
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

  function handleSubmit(e: any) {
    e.preventDefault()
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        category ? callback({ ...category, name: values.name }) : callback(values)
      }
    })
  }

  const formTitle = category ? 'Edit Category' : 'Add Category'

  return (
    <Card title={formTitle} bordered={false}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Category Name">
          {getFieldDecorator('name', {
            initialValue: category ? category.name : '',
            rules: [
              {
                required: true,
                message: 'Please input a category name',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {category ? 'Edit' : 'Add'}
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

const _this: any = Form.create({ name: 'categoryForm' })(CategoryForm)
export default _this
