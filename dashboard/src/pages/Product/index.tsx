import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Card, Icon, Select } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { categoryRepository, productRepository } from '../../services/repositories'
import utils from '../../services/utils'
import { Product } from '../../typings'

import Loading from '../../components/Loading'
import CreateForm from './CreateForm'
import './Product.scss'

const ProductIndex = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [isFinding, setFinding] = useState(false)

  const setActiveCategory = useStoreActions(a => a.activeState.setCategoryId)
  const setCategories = useStoreActions(a => a.categoryState.setCategories)
  const createProduct = useStoreActions(a => a.productState.create)

  const user = useStoreState(s => s.userState.user)

  const categories = useStoreState(s => s.categoryState.categories)
  const categoryId = useStoreState(s => s.activeState.categoryId)
  const activeCategory = categories.find(c => c.id === categoryId)

  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  useEffect(() => {
    if (!activeShop) return
    ;(async () => {
      setLoading(true)
      if (categories.length < 1) {
        setCategories(await categoryRepository.findByShop(activeShop.id))
      }
      setLoading(false)

      if (activeCategory) {
        setFinding(true)
        setProducts(await productRepository.findByCategory(activeCategory.id))
        setFinding(false)
      }
    })()
  }, [activeShop, activeCategory, categories, setCategories])

  const handleCreateProduct = async (values: any) => {
    if (!user || !activeShop || !activeCategory) return
    const product: Product = {
      id: utils.genId(),
      name: values.productName,
      categoryId: activeCategory.id,
      shopId: activeShop.id,
      pageId: activeShop.pageId,
      owner: user,
    }
    setProducts([product, ...products])
    createProduct(product)
    setFormEnabled(false)
  }

  return (
    <div>
      <Card title="Products" bordered={false}>
        {isLoading ? (
          <Loading position="left" />
        ) : categories.length < 1 ? (
          <Redirect to="/category" />
        ) : (
          <div>
            <div>
              <span style={{ paddingRight: 10 }}>Category:</span>
              <Select
                style={{ width: 200 }}
                placeholder="Please Choose"
                onChange={(key: string) => setActiveCategory(key)}
                defaultValue={activeCategory?.id}
              >
                {categories.map(category => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
              {isFinding && (
                <Icon type="loading" style={{ color: '#999', fontSize: 15, paddingLeft: 10 }} />
              )}
            </div>
            {products.length > 0 && (
              <ul className="products">
                {products.map(p => (
                  <li key={p.id} className="product">
                    {p.name}
                  </li>
                ))}
              </ul>
            )}
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
