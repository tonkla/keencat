import React, { useEffect, useState } from 'react'
import { Button, Card } from 'antd'

import { useStoreActions } from '../../store'
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
  const [categories, setCategories] = useState<Category[]>([])

  const createCategory = useStoreActions(a => a.categoryState.create)

  // Fetch categories
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setCategories(await categoryRepository.findByIds(shop.categoryIds))
      setLoading(false)
    })()
  }, [shop, setCategories])

  const handleCreateCategory = async (values: any) => {
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
  }

  return (
    <div>
      <Card title="Categories" bordered={false}>
        {isLoading ? (
          <Loading />
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
