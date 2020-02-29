import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Alert, Button, Card, Descriptions, Input, message, Modal, Switch } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { productRepository } from '../../services/repositories'
import { Product } from '../../typings'

import Back from '../../components/Back'
import Loading from '../../components/Loading'
import Upload from '../../components/Upload'
import Form from './Form'
import './Product.scss'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [isFormEnabled, enableForm] = useState(false)
  const [deletingConfirm, showDeletingConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')
  const [isDeleted, setDeleted] = useState(false)
  const [error, setError] = useState<Error>()

  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  const updateProduct = useStoreActions(a => a.productState.update)
  const deleteProduct = useStoreActions(a => a.productState.remove)
  const products = useStoreState(s => s.productState.products)

  const history = useHistory()
  const { id } = useParams()

  useEffect(() => {
    if (!activeShop || !id) return

    if (isDeleted) {
      history.goBack()
      return
    }

    const p = products.find(p => p.id === id)
    if (p) setProduct(p)
    else {
      ;(async () => {
        const p = await productRepository.find(id)
        if (p) setProduct(p)
      })()
    }
  }, [activeShop, id, isDeleted, products, history])

  function handleUpdateProduct(product: Product) {
    enableForm(false)
    setProduct(product)
    updateProduct(product)
  }

  function handleDeleteProduct(product: Product) {
    showDeletingConfirm(false)
    if (product.name === confirmCode) {
      setDeleted(true)
      deleteProduct(product)
    }
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

  function handleDeleteImage(imageUrl: string) {
    if (!product || !product.images) return
    const images = product.images.filter(img => img !== imageUrl)
    const newProduct = { ...product, images }
    setProduct(newProduct)
    updateProduct(newProduct)
  }

  async function handleToggle(isActive: boolean) {
    if (!product) return
    updateProduct({ ...product, isActive })
    const text = isActive ? 'Product is available.' : 'Product is unavailable.'
    message.success(text)
  }

  function renderProductTitle(product: Product) {
    return (
      <div className="title">
        <span>{product.name}</span>
        <div className="actions">
          <Switch defaultChecked={product.isActive} onChange={handleToggle} />
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
          <Loading position="center" />
        </Card>
      ) : isFormEnabled ? (
        <Form product={product} callback={handleUpdateProduct} cancel={() => enableForm(false)} />
      ) : (
        <Card title={renderProductTitle(product)} bordered={false}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
            <Descriptions.Item label="Price">{product.price}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{product.quantity}</Descriptions.Item>
          </Descriptions>
          <Upload
            product={product}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            onRemove={handleDeleteImage}
          />
          {error && <Alert message={error.message} type="error" showIcon closable />}
        </Card>
      )}
    </div>
  )
}

export default ProductItem
