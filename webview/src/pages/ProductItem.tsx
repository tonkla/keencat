import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Button } from 'antd'

import { useStoreActions, useStoreState } from '../store'
import api from '../services/api'
import utils from '../services/utils'
import { CartItem, Product, RequestHeader } from '../typings'

import InputNumber from '../components/InputNumber'
import Loading from '../components/Loading'

import './ProductItem.scss'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [quantity, setQuantity] = useState(1)
  const [height, setHeight] = useState()

  const addToCart = useStoreActions(a => a.cartState.add)
  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  const history = useHistory()
  const location = useLocation()
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
    addToCart(item)
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
    addToCart(item)
    history.push(`/cart${location.search}`)
  }

  function handleClickBookNow() {}

  return !product ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main style={{ height }}>
        <div className="content product" style={{ height }}>
          <h1>{product.name}</h1>
          <div className="description">{product.description}</div>
          <div>
            <label>Price:</label>
            <span className="price">{product.price}</span>
          </div>
          <div>
            <label>Quantity:</label>
            <span className="quantity">{product.quantity}</span>
          </div>
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
