import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import axios from 'axios'

import { useStoreState } from '../store'
import { RequestHeader } from '../typings'

import './Cart.scss'

const Cart = () => {
  const [height, setHeight] = useState()

  const items = useStoreState(s => s.cartState.items)
  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
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
          const url = process.env.REACT_APP_WEBHOOK_URL
          if (url && hmac && pageId && customerId) {
            const headers: RequestHeader = {
              hmac,
              pageId,
              customerId,
            }
            const totalAmount = items.reduce((accum, item) => accum + item.amount, 0)
            await axios.create({ headers }).post(url, { order: { items, totalAmount } })
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
