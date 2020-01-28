import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card } from 'antd'

import { useStoreState, useStoreActions } from '../../store'
import utils from '../../services/utils'
import Category from '../../typings/category'
import Product from '../../typings/product'

import CreateForm from './CreateForm'

const ProductIndex = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const createProduct = useStoreActions(a => a.productState.create)

  const user = useStoreState(s => s.userState.user)
  const shop = useStoreState(s => s.activeState.shop)

  const handleCreateProduct = async (values: any) => {
    if (!user || !shop) return
    const product: Product = {
      id: utils.genId(),
      name: values.productName,
      categoryId: values.categoryId,
      shopId: shop.id,
      pageId: shop.pageId,
      owner: user.id,
    }
    createProduct(product)
    setFormEnabled(false)
  }

  useEffect(() => {
    ;(async () => {
      if (!shop) return
      // setCategories(await remoteStorage.getCategories(shop))
      setLoading(false)
    })()
  }, [shop])

  return categories.length === 0 ? (
    <Redirect to="/category" />
  ) : (
    <div>
      <Card title="Product" bordered={false}>
        {isLoading ? (
          <span>Loading...</span>
        ) : products.length === 0 ? (
          <span>There is no product, add a new one.</span>
        ) : (
          <ul>
            {products.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        )}
      </Card>
      {isFormEnabled ? (
        <Card title="Add Product" bordered={false} style={{ marginTop: 20 }}>
          <CreateForm
            categories={categories}
            callback={handleCreateProduct}
            cancel={() => setFormEnabled(false)}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', marginTop: 20 }}>
          <Button type="primary" onClick={() => setFormEnabled(true)}>
            Add Product
          </Button>
        </div>
      )}
    </div>
  )
}
export default ProductIndex
