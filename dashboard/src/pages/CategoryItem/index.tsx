import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Modal } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { Category } from '../../typings'

import ProductIndex from '../Product'
import Back from '../../components/Back'
import Loading from '../../components/Loading'

const CategoryItem = () => {
  const [category, setCategory] = useState<Category | null>(null)

  const deleteCategory = useStoreActions(a => a.categoryState.remove)
  const categories = useStoreState(s => s.categoryState.categories)

  const [categoriesLength] = useState(categories ? categories.length : 0)

  const history = useHistory()
  const { id } = useParams()

  useEffect(() => {
    // Category has been deleted
    if (categories.length !== categoriesLength) history.goBack()

    const c = categories.find(c => c.id === id)
    if (c) setCategory(c)
  }, [categories, categoriesLength, id, history])

  function handleDelete() {
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      content: 'The category and all of its products will be permanently deleted.',
      okType: 'danger',
      okText: 'Delete',
      cancelText: 'No',
      onOk() {
        if (category) deleteCategory(category)
      },
      onCancel() {},
    })
  }

  return (
    <div className="category">
      <Back />
      {category ? (
        <div>
          <Card title={`Category: ${category.name}`} bordered={false}>
            <span>{category.name}</span>
          </Card>
          <div className="buttons">
            <Button type="primary" icon="delete" onClick={handleDelete}>
              Delete
            </Button>
          </div>
          {category && <ProductIndex category={category} />}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default CategoryItem
