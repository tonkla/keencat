import React from 'react'
import { Button, Form, Input } from 'antd'

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

  function handleSubmit(e: any) {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) props.callback(values)
    })
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="Category Name">
        {getFieldDecorator('categoryName', {
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
          Add
        </Button>
        <div className="btn-cancel">
          <span className="link" onClick={props.cancel}>
            Cancel
          </span>
        </div>
      </Form.Item>
    </Form>
  )
}

const _this: any = Form.create({ name: 'createCategory' })(CreateForm)
export default _this
