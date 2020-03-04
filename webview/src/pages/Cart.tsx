import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import axios from 'axios'

import { useStoreState } from '../store'

import './Cart.scss'

const Cart = () => {
  const [height, setHeight] = useState()

  const items = useStoreState(s => s.cartState.items)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 75 : '85%'
    setHeight(height)
  }, [])

  function handleConfirm() {
    if (items.length < 1) return
    if (!(window as any).MessengerExtensions) return
    ;(window as any).MessengerExtensions.requestCloseBrowser(
      async function success() {
        try {
          const authorization = process.env.REACT_APP_WEBHOOK_TOKEN || ''
          const url = process.env.REACT_APP_WEBHOOK_URL || ''
          if (url) {
            const totalAmount = items.reduce((accum, item) => accum + item.amount, 0)
            const pageId = items[0].product.pageId
            await axios
              .create({ headers: { authorization } })
              .post(url, { order: { items, totalAmount, pageId, customerId } })
          }
        } catch (e) {}
      },
      function error(err: any) {}
    )
  }

  return (
    <>
      <main>
        <div className="cart" style={{ height }}>
          <h1>Cart</h1>
          {items.length > 0 && (
            <ul>
              {items.map((item, idx) => (
                <li key={idx}>{item.id}</li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer>
        <Button type="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </footer>
    </>
  )
}

export default Cart
