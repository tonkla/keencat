import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Input, Modal } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { categoryRepository } from '../../services/repositories'
import { Category } from '../../typings'

import Back from '../../components/Back'
import Loading from '../../components/Loading'
import ProductList from '../Product'
import Form from './Form'

const CategoryItem = () => {
  const [category, setCategory] = useState<Category | null>(null)
  const [isFormEnabled, enableForm] = useState(false)
  const [deletingConfirm, showDeletingConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')
  const [isDeleted, setDeleted] = useState(false)

  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  const updateCategory = useStoreActions(a => a.categoryState.update)
  const deleteCategory = useStoreActions(a => a.categoryState.remove)
  const categories = useStoreState(s => s.categoryState.categories)

  const history = useHistory()
  const { id } = useParams()

  useEffect(() => {
    if (!activeShop || !id) return

    if (isDeleted) {
      history.goBack()
      return
    }

    const c = categories.find(c => c.id === id)
    if (c) setCategory(c)
    else {
      ;(async () => {
        const c = await categoryRepository.find(id)
        if (c) setCategory(c)
      })()
    }
  }, [activeShop, id, isDeleted, categories, history])

  function handleUpdateCategory(category: Category) {
    enableForm(false)
    setCategory(category)
    updateCategory(category)
  }

  function handleDeleteCateogory(category: Category) {
    showDeletingConfirm(false)
    if (category.name === confirmCode) {
      setDeleted(true)
      deleteCategory(category)
    }
  }

  function renderCategoryTitle(category: Category) {
    return (
      <div className="title">
        <span>{category.name}</span>
        <div className="actions">
          <Button
            icon="edit"
            shape="circle"
            title="Edit Category"
            onClick={() => enableForm(true)}
          />
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
      {!category ? (
        <Card>
          <Loading />
        </Card>
      ) : isFormEnabled ? (
        <Form
          category={category}
          callback={handleUpdateCategory}
          cancel={() => enableForm(false)}
        />
      ) : (
        <div>
          <Card title={renderCategoryTitle(category)} className="detail" bordered={false}></Card>
          <ProductList category={category} />
        </div>
      )}
    </div>
  )
}

export default CategoryItem
