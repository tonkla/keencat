import React, { useEffect, useState } from 'react'
import { Button, Card } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { productRepository } from '../../services/repositories'
import utils from '../../services/utils'
import { Category, Product } from '../../typings'

import Loading from '../../components/Loading'
import Form from './Form'
import List from './List'
import './Product.scss'

interface Props {
  category: Category
}

const ProductList = ({ category }: Props) => {
  const [isFormEnabled, enableForm] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const createProduct = useStoreActions(a => a.productState.create)
  const setProducts = useStoreActions(a => a.productState.setProducts)
  const products = useStoreState(s => s.productState.products)
  const user = useStoreState(s => s.userState.user)

  // Fetch products
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (
        category.productIds.length !== products.length ||
        (products.length > 0 && products[0].categoryId !== category.id)
      ) {
        setProducts(await productRepository.findByIds(category.productIds))
      }
      setLoading(false)
    })()
  }, [category, products, setProducts])

  async function handleCreateProduct(values: any) {
    if (!user) return
    const product: Product = {
      id: utils.genId(),
      isActive: true,
      categoryId: category.id,
      shopId: category.shopId,
      pageId: category.pageId,
      ownerId: user.firebaseId,
      type: values.type,
      name: values.name,
      description: values.description,
      price: values.price,
      amount: values.amount,
    }
    createProduct(product)
    enableForm(false)
    setLoading(true)
  }

  function renderProductsTitle() {
    return (
      <div className="title">
        <span>Products</span>
        <div className="actions">
          <Button icon="plus" shape="circle" title="Add Product" onClick={() => enableForm(true)} />
        </div>
      </div>
    )
  }

  return (
    <div className="products">
      {isFormEnabled && <Form callback={handleCreateProduct} cancel={() => enableForm(false)} />}
      <Card title={renderProductsTitle()} bordered={false}>
        {isLoading ? (
          <Loading />
        ) : products.length > 0 ? (
          <List products={products} />
        ) : (
          <span>There is no product, please add a new one.</span>
        )}
      </Card>
    </div>
  )
}

export default ProductList
