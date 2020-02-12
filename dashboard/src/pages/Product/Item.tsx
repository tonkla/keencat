import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Alert, Button, Card, Input, Modal } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { productRepository } from '../../services/repositories'
import { Product } from '../../typings'

import Back from '../../components/Back'
import Loading from '../../components/Loading'
import Upload from '../../components/Upload'
import Form from './Form'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [isFormEnabled, enableForm] = useState(false)
  const [deletingConfirm, showDeletingConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')
  const [error, setError] = useState<Error>()

  const updateProduct = useStoreActions(a => a.productState.update)
  const deleteProduct = useStoreActions(a => a.productState.remove)
  const products = useStoreState(s => s.productState.products)

  const [productsLength] = useState(products ? products.length : 0)

  const history = useHistory()
  const { id } = useParams()

  useEffect(() => {
    // Product has been deleted
    if (products.length !== productsLength) history.goBack()

    if (!id) return
    const p = products.find(p => p.id === id)
    if (p) setProduct(p)
    else {
      ;(async () => {
        const p = await productRepository.find(id)
        if (p) setProduct(p)
      })()
    }
  }, [products, productsLength, id, history])

  function handleUpdateProduct(product: Product) {
    enableForm(false)
    setProduct(product)
    updateProduct(product)
  }

  function handleDeleteProduct(product: Product) {
    showDeletingConfirm(false)
    if (product.name === confirmCode) deleteProduct(product)
  }

  function handleUploadSuccess(imageUrl: string) {
    if (!product) return
    const newProduct =
      product.images && product.images.length > 0
        ? { ...product, images: [...product.images, imageUrl] }
        : { ...product, images: [imageUrl] }
    setProduct(newProduct)
    updateProduct(newProduct)
  }

  function handleUploadError(error: Error) {
    setError(error)
  }

  function handleRemoveImage(imageUrl: string) {
    if (!product || !product.images) return
    const images = product.images.filter(img => img !== imageUrl)
    const newProduct = { ...product, images }
    setProduct(newProduct)
    updateProduct(newProduct)
  }

  function renderProductTitle(product: Product) {
    return (
      <div className="title">
        <span>{product.name}</span>
        <div className="actions">
          <Button
            icon="edit"
            shape="circle"
            title="Edit Product"
            onClick={() => enableForm(true)}
          />
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
      {!product ? (
        <Card>
          <Loading />
        </Card>
      ) : isFormEnabled ? (
        <Form product={product} callback={handleUpdateProduct} cancel={() => enableForm(false)} />
      ) : (
        <Card title={renderProductTitle(product)} bordered={false}>
          <span>{product.description}</span>
          <Upload
            product={product}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            onRemove={handleRemoveImage}
          />
          {error && <Alert message={error.message} type="error" showIcon closable />}
        </Card>
      )}
    </div>
  )
}

export default ProductItem
