import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'antd'
import axios from 'axios'

import { useStoreActions, useStoreState } from '../store'
import { CartItem, RequestHeader } from '../typings'

import InputNumber from '../components/InputNumber'
import './Cart.scss'

const Cart = () => {
  const [height, setHeight] = useState()

  const location = useLocation()

  const updateCart = useStoreActions(a => a.cartState.update)
  const items = useStoreState(s => s.cartState.items)
  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 75 : '85%'
    setHeight(height)
  }, [])

  const totalAmount = useMemo(() => items.reduce((accum, item) => accum + item.amount, 0), [items])

  function handleConfirm() {
    if (items.length < 1) return
    if (!(window as any).MessengerExtensions) return
    ;(window as any).MessengerExtensions.requestCloseBrowser(
      async function success() {
        try {
          const url = process.env.REACT_APP_WEBHOOK_URL
          if (url && hmac && pageId && customerId) {
            const headers: RequestHeader = {
              hmac,
              pageId,
              customerId,
            }
            await axios.create({ headers }).post(url, { order: { items, totalAmount } })
          }
        } catch (e) {}
      },
      function error(err: any) {}
    )
  }

  function handleChangeQuantity(item: CartItem, quantity: number) {
    const rest = items.filter(i => i.id !== item.id)
    if (quantity > 0) {
      updateCart([...rest, { ...item, quantity, amount: quantity * item.product.price }])
    } else {
      updateCart(rest)
    }
  }

  return (
    <>
      <main>
        <div className="cart" style={{ height }}>
          <h1>Cart</h1>
          {items.length > 0 && (
            <ul>
              {items.map(item => (
                <li key={item.id}>
                  <Link to={`/p/${item.product.id}${location.search}`}>
                    <div
                      className="cover"
                      style={{
                        backgroundImage:
                          item.product.images && item.product.images.length > 0
                            ? `url(${item.product.images[0]})`
                            : 'none',
                      }}
                    />
                  </Link>
                  <div className="details">
                    <div className="name">
                      <span>{item.product.name}</span>
                    </div>
                    <div className="price">
                      <label>Price:</label>
                      <span className="number">{item.product.price}</span>
                    </div>
                    <div className="quantity">
                      <label>Quantity:</label>
                      <span>{item.quantity}</span>
                    </div>
                    <div className="amount">
                      <label>Amount:</label>
                      <span>{item.amount}</span>
                    </div>
                    <div>
                      <InputNumber
                        defaultValue={item.quantity}
                        min={0}
                        max={item.product.quantity}
                        callback={(qty: number) => handleChangeQuantity(item, qty)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer>
        <div className="total-amount">
          <span>Total</span>
          <span className="number">{totalAmount}</span>
          <span>THB</span>
        </div>
        <Button type="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </footer>
    </>
  )
}

export default Cart
