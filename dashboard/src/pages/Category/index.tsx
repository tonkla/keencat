import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import categoryRepository from '../../services/repositories/category'
import utils from '../../services/utils'
import { Category } from '../../typings'

import Loading from '../../components/Loading'
import CreateForm from './CreateForm'
import List from './List'
import './Category.scss'

const CategoryIndex = () => {
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const createCategory = useStoreActions(a => a.categoryState.create)
  const setCategories = useStoreActions(a => a.categoryState.setCategories)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)
  const categories = useStoreState(s => s.categoryState.categories)

  // Fetch categories
  useEffect(() => {
    if (!user || !activeShop) return
    ;(async () => {
      setLoading(true)
      setCategories(await categoryRepository.findByIds(activeShop.categoryIds))
      setLoading(false)
    })()
  }, [user, activeShop, setCategories])

  const handleCreateCategory = async (values: any) => {
    if (!user || !activeShop) return
    const category: Category = {
      id: utils.genId(),
      name: values.categoryName,
      shopId: activeShop.id,
      pageId: activeShop.pageId,
      productIds: [],
      ownerId: user.firebaseId,
    }
    createCategory(category)
    setFormEnabled(false)
  }

  return (
    <div>
      <Card title="Categories" bordered={false}>
        {isLoading ? (
          <Loading />
        ) : shops.length < 1 ? (
          <Redirect to="/shops" />
        ) : categories.length > 0 ? (
          <List categories={categories} />
        ) : (
          <span>There is no category, please add a new one.</span>
        )}
      </Card>
      {isFormEnabled ? (
        <Card title="Add Category" bordered={false} style={{ marginTop: 20 }}>
          <CreateForm callback={handleCreateCategory} cancel={() => setFormEnabled(false)} />
        </Card>
      ) : (
        <div className="buttons">
          <Button type="primary" onClick={() => setFormEnabled(true)}>
            Add Category
          </Button>
        </div>
      )}
    </div>
  )
}

export default CategoryIndex
