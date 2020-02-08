import React, { useEffect, useState } from 'react'
import { Button, Card } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { productRepository } from '../../services/repositories'
import utils from '../../services/utils'
import { Category, Product } from '../../typings'

import Loading from '../../components/Loading'
import CreateForm from './CreateForm'
import List from './List'
import './Product.scss'

interface Props {
  category: Category
}

const ProductIndex = ({ category }: Props) => {
  const [isFormEnabled, setFormEnabled] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const setProducts = useStoreActions(a => a.productState.setProducts)
  const createProduct = useStoreActions(a => a.productState.create)

  const user = useStoreState(s => s.userState.user)
  const products = useStoreState(s => s.productState.products)

  // Fetch products
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setProducts(await productRepository.findByIds(category.productIds))
      setLoading(false)
    })()
  }, [category, setProducts])

  async function handleCreateProduct(values: any) {
    if (!user) return
    const product: Product = {
      id: utils.genId(),
      name: values.productName,
      categoryId: category.id,
      shopId: category.shopId,
      pageId: category.pageId,
      ownerId: user.firebaseId,
    }
    createProduct(product)
    setFormEnabled(false)
  }

  return (
    <div className="products">
      <Card title="Products" bordered={false}>
        {isLoading ? <Loading /> : products.length > 0 && <List products={products} />}
      </Card>
      {isFormEnabled ? (
        <Card title="Add Product" bordered={false} style={{ marginTop: 20 }}>
          <CreateForm callback={handleCreateProduct} cancel={() => setFormEnabled(false)} />
        </Card>
      ) : (
        category && (
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
