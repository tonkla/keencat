import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'

import api from '../services/api'
import utils from '../services/utils'
import { useStoreActions, useStoreState } from '../store'
import { CartItem, Product } from '../typings'

import Header from '../components/Header'
import InputNumber from '../components/InputNumber'
import Loading from '../components/Loading'

import './ProductItem.scss'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [quantity, setQuantity] = useState(1)

  const updateCart = useStoreActions(a => a.cartState.update)
  const customerId = useStoreState(s => s.sessionState.customerId)

  const history = useHistory()
  const { pid } = useParams()

  useEffect(() => {
    if (!pid) return
    ;(async () => {
      const product = await api.findProduct(pid)
      if (product) setProduct(product)
    })()
  }, [pid])

  function handleChangeQuantity(qty: number) {
    setQuantity(qty)
  }

  function handleClickAddToCart() {
    if (!product || !customerId) return
    const item: CartItem = {
      id: utils.genId(),
      product,
      quantity,
      amount: product.price * quantity,
      shopId: product.shopId,
      pageId: product.pageId,
      customerId,
      updatedAt: new Date().toISOString(),
    }
    updateCart(item)
  }

  function handleClickBuyNow() {
    if (!product || !customerId) return
    const item: CartItem = {
      id: utils.genId(),
      product,
      quantity,
      amount: product.price * quantity,
      shopId: product.shopId,
      pageId: product.pageId,
      customerId,
      updatedAt: new Date().toISOString(),
    }
    updateCart(item)
    history.push('/cart')
  }

  function handleClickBookNow() {}

  const elMain = document.getElementById('container')
  const height = elMain ? elMain.offsetHeight - 75 : '90%'

  return !product ? (
    <div className="mt40">
      <Loading />
    </div>
  ) : (
    <>
      <Header />
      <main style={{ height }}>
        <div className="product" style={{ height }}>
          <h1>{product.name}</h1>
          <div className="description">{product.description}</div>
          <div>
            <span className="label">Price: </span>
            <span className="price">{product.price}</span>
          </div>
          <div>
            <span className="label">Quantity: </span>
            <span className="quantity">{product.quantity}</span>
          </div>
          {product.images &&
            product.images.map((img, idx) => (
              <div key={idx} className="image" style={{ backgroundImage: `url(${img})` }} />
            ))}
          {product.images &&
            product.images.map((img, idx) => (
              <div key={idx} className="image" style={{ backgroundImage: `url(${img})` }} />
            ))}
        </div>
      </main>
      <footer>
        {product.type === 'goods' ? (
          <>
            <InputNumber
              defaultValue={1}
              min={1}
              max={product.quantity}
              callback={handleChangeQuantity}
            />
            <Button type="primary" onClick={handleClickAddToCart}>
              Add to Cart
            </Button>
            <Button type="primary" onClick={handleClickBuyNow}>
              Buy Now
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={handleClickBookNow}>
              Book Now
            </Button>
          </>
        )}
      </footer>
    </>
  )
}

export default ProductItem
