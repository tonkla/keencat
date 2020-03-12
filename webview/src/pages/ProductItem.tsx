import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Carousel } from 'antd'

import { useStoreActions, useStoreState } from '../store'
import api from '../services/api'
import utils from '../services/utils'
import { CartItem, Product } from '../typings'

import InputNumber from '../components/InputNumber'
import Loading from '../components/Loading'

import './ProductItem.scss'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [quantity, setQuantity] = useState(1)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const addToCart = useStoreActions(a => a.cartState.add)
  const session = useStoreState(s => s.sessionState.session)

  const history = useHistory()
  const location = useLocation()
  const { pid } = useParams()

  useEffect(() => {
    if (!(pid && session)) return
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 80 : 0
    const width = elMain ? elMain.offsetWidth : 0
    setHeight(height)
    setWidth(width)
    ;(async () => {
      const product = await api.findProduct(session, pid)
      if (product) setProduct(product)
    })()
  }, [pid, session])

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

  const itemUnit = product && product.quantity > 1 ? 'items' : 'item'

  return !product ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main>
        <div className="content product" style={{ height: height > 0 ? height : '85%' }}>
          <Carousel>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div key={idx}>
                  <div
                    className="img"
                    style={{
                      height: 300,
                      width: width > 0 ? width - 20 : 300,
                      backgroundImage: `url('${img}')`,
                    }}
                  />
                </div>
              ))
            ) : (
              <div>
                <div
                  className="img"
                  style={{
                    height: 300,
                    width: width > 0 ? width - 20 : 300,
                  }}
                />
              </div>
            )}
          </Carousel>
          <div className="details">
            <div className="wrapper">
              <span className="price">฿{product.price.toLocaleString()}</span>
              <span className="quantity">{`(only ${product.quantity} ${itemUnit} left)`}</span>
            </div>
            <div className="name">
              <span>{product.name}</span>
            </div>
            <div className="description">
              <span>{product.description}</span>
            </div>
          </div>
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
