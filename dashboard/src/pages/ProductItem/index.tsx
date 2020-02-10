import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Input, Modal } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { Product } from '../../typings'

import Back from '../../components/Back'
import Loading from '../../components/Loading'

const ProductItem = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [deletingConfirm, showDeletingConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')

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

  function handleDeleteProduct(product: Product) {
    showDeletingConfirm(false)
    if (product.name === confirmCode) deleteProduct(product)
  }

  function renderProductTitle(product: Product) {
    return (
      <div className="title">
        <span>{product.name}</span>
        <div className="actions">
          <Button
            icon="delete"
            shape="circle"
            title="Delete Product"
            onClick={() => showDeletingConfirm(true)}
          />
        </div>
        <Modal
          title="Are you sure you want to delete?"
          visible={deletingConfirm}
          onOk={() => handleDeleteProduct(product)}
          onCancel={() => showDeletingConfirm(false)}
          className="dialog-confirm-deleting"
        >
          <span>The product will be permanently deleted.</span>
          <div className="row">
            <span>Please type the product name to confirm deleting.</span>
          </div>
          <div className="row">
            <Input
              placeholder={product.name}
              onChange={e => setConfirmCode(e.currentTarget.value)}
            />
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div className="product">
      <Back />
      {product ? (
        <Card title={renderProductTitle(product)} bordered={false}>
          <span>{product.name}</span>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProductItem
