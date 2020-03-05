import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'

import { useStoreActions, useStoreState } from '../store'
import api from '../services/api'
import utils from '../services/utils'
import { CartItem, Product, RequestHeader } from '../typings'

import InputNumber from '../components/InputNumber'
import Loading from '../components/Loading'

import './ProductItem.scss'

const ProductItem = () => {
  const [height, setHeight] = useState()
  const [product, setProduct] = useState<Product>()
  const [quantity, setQuantity] = useState(1)

  const updateCart = useStoreActions(a => a.cartState.update)
  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  const history = useHistory()
  const { pid } = useParams()

  useEffect(() => {
    if (!(pid && hmac && pageId && customerId)) return
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 75 : '85%'
    setHeight(height)
    ;(async () => {
      const headers: RequestHeader = {
        hmac,
        pageId,
        customerId,
      }
      const product = await api.findProduct(headers, pid)
      if (product) setProduct(product)
    })()
  }, [pid, hmac, pageId, customerId])

  function handleChangeQuantity(qty: number) {
    setQuantity(qty)
  }

  function handleClickAddToCart() {
    if (!product) return
    const item: CartItem = {
      id: utils.genId(),
      product,
      quantity,
      amount: product.price * quantity,
      updatedAt: new Date().toISOString(),
    }
    updateCart(item)
  }

  function handleClickBuyNow() {
    if (!product) return
    const item: CartItem = {
      id: utils.genId(),
      product,
      quantity,
      amount: product.price * quantity,
      updatedAt: new Date().toISOString(),
    }
    updateCart(item)
    history.push('/cart')
  }

  function handleClickBookNow() {}

  return !product ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
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
