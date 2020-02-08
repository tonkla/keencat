import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Modal } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { Product } from '../../typings'

import Back from '../../components/Back'
import Loading from '../../components/Loading'

const ProductItem = () => {
  const [product, setProduct] = useState<Product | null>(null)

  const deleteProduct = useStoreActions(a => a.productState.remove)
  const products = useStoreState(s => s.productState.products)

  const [productsLength] = useState(products ? products.length : 0)

  const history = useHistory()
  const { id } = useParams()

  useEffect(() => {
    // Product has been deleted
    if (products.length !== productsLength) history.goBack()

    const p = products.find(p => p.id === id)
    if (p) setProduct(p)
  }, [products, productsLength, id, history])

  function handleDelete() {
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      content: 'The product will be permanently deleted.',
      okType: 'danger',
      okText: 'Delete',
      cancelText: 'No',
      onOk() {
        if (product) deleteProduct(product)
      },
      onCancel() {},
    })
  }

  return (
    <div className="product">
      <Back />
      {product ? (
        <div>
          <Card title={`Product: ${product.name}`} bordered={false}>
            <span>{product.name}</span>
          </Card>
          <div className="buttons">
            <Button type="primary" icon="delete" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProductItem
