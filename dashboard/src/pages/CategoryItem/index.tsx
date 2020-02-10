import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Input, Modal } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { Category } from '../../typings'

import ProductIndex from '../Product'
import Back from '../../components/Back'
import Loading from '../../components/Loading'

const CategoryItem = () => {
  const [category, setCategory] = useState<Category | null>(null)
  const [deletingConfirm, showDeletingConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')

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

  function handleDeleteCateogory(category: Category) {
    showDeletingConfirm(false)
    if (category.name === confirmCode) deleteCategory(category)
  }

  function renderCategoryTitle(category: Category) {
    return (
      <div className="title">
        <span>{category.name}</span>
        <div className="actions">
          <Button
            icon="delete"
            shape="circle"
            title="Delete Category"
            onClick={() => showDeletingConfirm(true)}
          />
        </div>
        <Modal
          title="Are you sure you want to delete?"
          visible={deletingConfirm}
          onOk={() => handleDeleteCateogory(category)}
          onCancel={() => showDeletingConfirm(false)}
          className="dialog-confirm-deleting"
        >
          <span>The category and all of its products will be permanently deleted.</span>
          <div className="row">
            <span>Please type the category name to confirm deleting.</span>
          </div>
          <div className="row">
            <Input
              placeholder={category.name}
              onChange={e => setConfirmCode(e.currentTarget.value)}
            />
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div className="category">
      <Back />
      {category ? (
        <div>
          <Card title={renderCategoryTitle(category)} bordered={false}>
            <span>.</span>
          </Card>
          <ProductIndex category={category} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default CategoryItem
