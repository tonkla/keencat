import React, { useEffect, useState } from 'react'
import { Button, Card } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import categoryRepository from '../../services/repositories/category'
import utils from '../../services/utils'
import { Category } from '../../typings'

import Loading from '../../components/Loading'
import CreateForm from './CreateForm'

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

  const handleCreateCategory = async (values: any) => {
    if (!user || !activeShop) return
    const category: Category = {
      id: utils.genId(),
      name: values.categoryName,
      shopId: activeShop.id,
      pageId: activeShop.pageId,
      owner: user,
    }
    createCategory(category)
    setFormEnabled(false)
  }

  useEffect(() => {
    if (!user || !activeShop) return
    ;(async () => {
      setLoading(true)
      setCategories(await categoryRepository.findByShop(activeShop.id))
      setLoading(false)
    })()
  }, [user, activeShop, setCategories])

  return (
    <div>
      <Card title="Categories" bordered={false}>
        {isLoading ? (
          <Loading position="left" />
        ) : categories.length === 0 ? (
          <span>There is no category, add a new one.</span>
        ) : (
          <ul>
            {categories.map(c => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        )}
      </Card>
      {isFormEnabled ? (
        <Card title="Add Category" bordered={false} style={{ marginTop: 20 }}>
          <CreateForm callback={handleCreateCategory} cancel={() => setFormEnabled(false)} />
        </Card>
      ) : (
        <div style={{ display: 'flex', marginTop: 20 }}>
          <Button type="primary" onClick={() => setFormEnabled(true)}>
            Add Category
          </Button>
        </div>
      )}
    </div>
  )
}
export default CategoryIndex
