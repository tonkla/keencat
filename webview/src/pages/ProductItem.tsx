import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Carousel } from 'antd'

import { useStoreActions, useStoreState } from '../store'
import api from '../services/api'
import utils from '../services/utils'
import {
  BookingCallbackParams,
  CartItemGoods,
  CartItemServiceDay,
  CartItemServiceHour,
  CartItemServiceMonth,
  CartItemTypeEnum,
  Product,
  ProductChargeTypeEnum,
  ProductTypeEnum,
} from '../typings'

import Booking from '../components/Booking'
import InputNumber from '../components/InputNumber'
import Loading from '../components/Loading'

import './ProductItem.scss'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [quantity, setQuantity] = useState(1)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [buyNow, setBuyNow] = useState(false)
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

  function handleClickAddToCart(buyNow: boolean) {
    if (!product) return
    const item: CartItemGoods = {
      kind: CartItemTypeEnum.Goods,
      id: utils.genId(),
      product,
      quantity,
      amount: product.price * quantity,
    }
    addToCart(item)
    if (buyNow) history.push(`/cart${location.search}`)
  }

  function handleClickAddServiceToCart() {
    setBuyNow(false)
    setShowBookingModal(true)
  }

  function handleClickBuyServiceNow() {
    setBuyNow(true)
    setShowBookingModal(true)
  }

  function handleBookingOk({ from, to, days, hour, month }: BookingCallbackParams) {
    if (!product) return
    if (product.chargeType === ProductChargeTypeEnum.Hourly) {
      if (from === '' || hour === '') return
      const item: CartItemServiceHour = {
        kind: CartItemTypeEnum.Hourly,
        id: utils.genId(),
        product,
        date: from,
        hour,
        amount: product.price,
      }
      addToCart(item)
    }
    //
    else if (product.chargeType === ProductChargeTypeEnum.Daily) {
      if (from === '' || to === '' || days === 0) return
      const item: CartItemServiceDay = {
        kind: CartItemTypeEnum.Daily,
        id: utils.genId(),
        product,
        from,
        to,
        days,
        amount: product.price * days,
      }
      addToCart(item)
    }
    //
    else if (product.chargeType === ProductChargeTypeEnum.Monthly) {
      if (month === '') return
      const item: CartItemServiceMonth = {
        kind: CartItemTypeEnum.Monthly,
        id: utils.genId(),
        product,
        month,
        amount: product.price,
      }
      addToCart(item)
    }
    setShowBookingModal(false)
    if (buyNow) history.push(`/cart${location.search}`)
  }

  function handleBookingCancel() {
    setShowBookingModal(false)
  }

  function displayChargeType(chargeType: string) {
    switch (chargeType) {
      case ProductChargeTypeEnum.Hourly:
        return '/ Hour'
      case ProductChargeTypeEnum.Daily:
        return '/ Day'
      case ProductChargeTypeEnum.Monthly:
        return '/ Month'
      default:
        return ''
    }
  }

  const itemUnit = product && product.quantity && product.quantity > 1 ? 'items' : 'item'

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
                    }}
                  >
                    <img src={img} alt={`${product.name}-${idx}`} />
                  </div>
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
                >
                  <span>No Image</span>
                </div>
              </div>
            )}
          </Carousel>
          <div className="details">
            <div className="wrapper">
              <span className="price">฿{product.price.toLocaleString()}</span>
              {product.type === ProductTypeEnum.Goods && product.quantity !== undefined && (
                <span className="quantity">{`(only ${product.quantity} ${itemUnit} left)`}</span>
              )}
              {product.type === ProductTypeEnum.Service && product.chargeType !== undefined && (
                <span className="quantity">{displayChargeType(product.chargeType)}</span>
              )}
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
        {product.type === ProductTypeEnum.Goods ? (
          <>
            <InputNumber
              defaultValue={1}
              min={1}
              max={product.quantity || 1}
              callback={handleChangeQuantity}
            />
            <Button type="primary" onClick={() => handleClickAddToCart(false)}>
              Add to Cart
            </Button>
            <Button type="primary" onClick={() => handleClickAddToCart(true)}>
              Buy Now
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={handleClickAddServiceToCart}>
              Add to Cart
            </Button>
            <Button type="primary" onClick={handleClickBuyServiceNow}>
              Buy Now
            </Button>
          </>
        )}
      </footer>
      <Booking
        product={product}
        visible={showBookingModal}
        handleOk={handleBookingOk}
        handleCancel={handleBookingCancel}
      />
    </>
  )
}

export default ProductItem
