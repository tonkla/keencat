import React, { useEffect, useState } from 'react'
import { Button, Card } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import categoryRepository from '../../services/repositories/category'
import utils from '../../services/utils'
import { Category, Shop, User } from '../../typings'

import Loading from '../../components/Loading'
import CreateForm from './CreateForm'
import List from './List'
import './Category.scss'

interface Props {
  shop: Shop
  user: User
}

const CategoryIndex = ({ shop, user }: Props) => {
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const createCategory = useStoreActions(a => a.categoryState.create)
  const setCategories = useStoreActions(a => a.categoryState.setCategories)
  const categories = useStoreState(s => s.categoryState.categories)

  // Fetch categories
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (shop.categoryIds.length !== categories.length) {
        setCategories(await categoryRepository.findByIds(shop.categoryIds))
      }
      setLoading(false)
    })()
  }, [shop, categories, setCategories])

  async function handleCreateCategory(values: any) {
    const category: Category = {
      id: utils.genId(),
      name: values.categoryName,
      shopId: shop.id,
      pageId: shop.pageId,
      productIds: [],
      ownerId: user.firebaseId,
    }
    createCategory(category)
    setFormEnabled(false)
    setLoading(true)
  }

  function renderCategoriesTitle() {
    return (
      <div className="title">
        <span>Categories</span>
        <div className="actions">
          <Button
            icon="plus"
            shape="circle"
            title="Add Category"
            onClick={() => setFormEnabled(true)}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Card title={renderCategoriesTitle()} bordered={false}>
        {isLoading ? (
          <Loading />
        ) : categories.length > 0 ? (
          <List categories={categories} />
        ) : (
          <span>There is no category, please add a new one.</span>
        )}
      </Card>
      {isFormEnabled && (
        <Card title="Add Category" bordered={false} style={{ marginTop: 20 }}>
          <CreateForm callback={handleCreateCategory} cancel={() => setFormEnabled(false)} />
        </Card>
      )}
    </div>
  )
}

export default CategoryIndex
