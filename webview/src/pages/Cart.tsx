import React, { useEffect, useMemo, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button, Empty, Modal } from 'antd'
import axios from 'axios'

import { useStoreActions, useStoreState } from '../store'
import { CartItem } from '../typings'

import InputNumber from '../components/InputNumber'
import './Cart.scss'

const Cart = () => {
  const [height, setHeight] = useState()

  const history = useHistory()
  const location = useLocation()

  const updateCart = useStoreActions(a => a.cartState.update)
  const items = useStoreState(s => s.cartState.items)
  const session = useStoreState(s => s.sessionState.session)
  const customer = useStoreState(s => s.customerState.customer)

  useEffect(() => {
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 75 : '85%'
    setHeight(height)
  }, [])

  const totalAmount = useMemo(() => items.reduce((accum, item) => accum + item.amount, 0), [items])

  function handleClickConfirm() {
    if (items.length < 1) return

    const required = []
    if (!customer || !customer.name) {
      required.push('name')
    }
    if (!customer || !customer.phoneNumber) {
      required.push('phoneNumber')
    }
    if ((!customer || !customer.address) && items.find(i => i.product.type === 'goods')) {
      required.push('address')
    }

    if (required.length > 0) {
      Modal.confirm({
        title: 'Please add your info',
        content: (
          <ul style={{ marginBottom: 0 }}>
            {required.includes('name') && <li>Name</li>}
            {required.includes('phoneNumber') && <li>Phone Number</li>}
            {required.includes('address') && <li>Shipping Address</li>}
          </ul>
        ),
        okText: 'Add',
        onOk() {
          history.push(`/customer${location.search}&edit=true`)
        },
        onCancel() {},
      })
    } else if (customer) {
      Modal.confirm({
        title: 'Please confirm your info',
        content: (
          <div>
            {customer.name && (
              <div>
                <span>{customer.name}</span>
              </div>
            )}
            {customer.phoneNumber && (
              <div>
                <span>{customer.phoneNumber}</span>
              </div>
            )}
            {customer.address && (
              <div>
                <span>{customer.address}</span>
              </div>
            )}
          </div>
        ),
        okText: 'Confirm',
        onOk() {
          if (!(window as any).MessengerExtensions) return
          ;(window as any).MessengerExtensions.requestCloseBrowser(
            async function success() {
              try {
                const url = process.env.REACT_APP_WEBHOOK_URL
                if (url && session) {
                  await axios.create({ headers: session }).post(url, { items, customer })
                }
              } catch (e) {}
            },
            function error(err: any) {}
          )
        },
        cancelText: 'Edit',
        onCancel() {
          history.push(`/customer${location.search}&edit=true`)
        },
      })
    }
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
        <div className="content cart" style={{ height }}>
          <h1>Cart</h1>
          {items.length > 0 ? (
            <ul>
              {items.map(item => (
                <li key={item.id}>
                  <Link to={`/p/${item.product.id}${location.search}`}>
                    <div
                      className="cover"
                      style={{
                        backgroundImage:
                          item.product.images && item.product.images.length > 0
                            ? `url('${item.product.images[0]}')`
                            : 'none',
                      }}
                    />
                  </Link>
                  <div className="details">
                    <div className="name">
                      <span>{item.product.name}</span>
                    </div>
                    <div className="mt10">
                      <div className="wrapper">
                        <span className="price">฿{item.product.price.toLocaleString()}</span>
                        <span className="x">x</span>
                        <span className="quantity">{item.quantity}</span>
                        <div className="input">
                          <InputNumber
                            defaultValue={item.quantity}
                            min={0}
                            max={item.product.quantity}
                            callback={(qty: number) => handleChangeQuantity(item, qty)}
                          />
                        </div>
                      </div>
                      <div className="amount price">
                        <span>฿{item.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Item" />
          )}
        </div>
      </main>
      <footer>
        <div className="total-amount">
          <span>Total</span>
          <span className="price">฿{totalAmount.toLocaleString()}</span>
        </div>
        <Button type="primary" onClick={handleClickConfirm}>
          Confirm
        </Button>
      </footer>
    </>
  )
}

export default Cart
