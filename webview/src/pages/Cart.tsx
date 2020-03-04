import React from 'react'

import { useStoreState } from '../store'

import Header from '../components/Header'
import './Cart.scss'

const Cart = () => {
  const items = useStoreState(s => s.cartState.items)

  return (
    <>
      <Header />
      <main>
        <div className="cart">
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
    </>
  )
}

export default Cart
