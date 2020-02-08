import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card, Select } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { categoryRepository, productRepository } from '../../services/repositories'
import utils from '../../services/utils'
import { Product } from '../../typings'

import Loading from '../../components/Loading'
import CreateForm from './CreateForm'
import List from './List'
import './Product.scss'

const ProductIndex = () => {
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [isFinding, setFinding] = useState(false)

  const setActiveCategory = useStoreActions(a => a.activeState.setCategoryId)
  const setCategories = useStoreActions(a => a.categoryState.setCategories)
  const setProducts = useStoreActions(a => a.productState.setProducts)
  const createProduct = useStoreActions(a => a.productState.create)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)
  const categories = useStoreState(s => s.categoryState.categories)
  const categoryId = useStoreState(s => s.activeState.categoryId)
  const activeCategory = categories.find(c => c.id === categoryId)
  const products = useStoreState(s => s.productState.products)

  // Fetch categories
  useEffect(() => {
    if (!activeShop) {
      setLoading(false)
      return
    }
    ;(async () => {
      setLoading(true)
      setCategories(await categoryRepository.findByIds(activeShop.categoryIds))
      setLoading(false)
    })()
  }, [activeShop, setCategories])

  // Fetch products
  useEffect(() => {
    if (!activeCategory) return
    ;(async () => {
      setFinding(true)
      setProducts(await productRepository.findByIds(activeCategory.productIds))
      setFinding(false)
    })()
  }, [activeCategory, setProducts])

  async function handleCreateProduct(values: any) {
    if (!user || !activeShop || !activeCategory) return
    const product: Product = {
      id: utils.genId(),
      name: values.productName,
      categoryId: activeCategory.id,
      shopId: activeShop.id,
      pageId: activeShop.pageId,
      ownerId: user.firebaseId,
    }
    createProduct(product)
    setFormEnabled(false)
  }

  function handleChangeCategory(key: string) {
    if (!activeCategory || activeCategory.id !== key) setActiveCategory(key)
  }

  return (
    <div>
      <Card title="Products" bordered={false}>
        {isLoading ? (
          <Loading />
        ) : categories.length < 1 ? (
          <Redirect to="/categories" />
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight: 10 }}>Category:</span>
              <Select
                style={{ width: 200 }}
                placeholder="Please Choose"
                onChange={handleChangeCategory}
                defaultValue={activeCategory?.id}
              >
                {categories.map(category => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
              <div style={{ paddingLeft: 10 }}>
                {isFinding && <Loading showText={false} size="small" />}
              </div>
            </div>
            {products.length > 0 && <List products={products} />}
          </div>
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
        activeCategory && (
          <div style={{ display: 'flex', marginTop: 20 }}>
            <Button type="primary" onClick={() => setFormEnabled(true)}>
              Add Product
            </Button>
          </div>
        )
      )}
    </div>
  )
}
export default ProductIndex
