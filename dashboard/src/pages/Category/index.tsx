import React, { useEffect, useState } from 'react'
import { Button, Card } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
// import remoteStorage from '../../services/api'
// import utils from '../../services/utils'
// import { Category } from '../../typings'

import CreateForm from './CreateForm'

const CategoryIndex = () => {
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(true)

  // const createCategory = useStoreActions(a => a.categoryState.create)
  const setCategories = useStoreActions(a => a.categoryState.setCategories)

  const user = useStoreState(s => s.userState.user)
  const shop = useStoreState(s => s.activeState.shop)
  const categories = useStoreState(s => s.categoryState.categories)

  const handleCreateCategory = async (values: any) => {
    if (!user || !shop) return
    // const category: Category = {
    //   id: utils.genId(),
    //   name: values.categoryName,
    //   shopId: shop.id,
    //   pageId: shop.pageId,
    //   owner: user.id,
    // }
    // createCategory(category)
    setFormEnabled(false)
  }

  useEffect(() => {
    ;(async () => {
      if (!shop) return
      // setCategories(await remoteStorage.getCategories(shop))
      setLoading(false)
    })()
  }, [shop, setCategories])

  return (
    <div>
      <Card title="Category" bordered={false}>
        {isLoading ? (
          <span>Loading...</span>
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
