import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Badge } from 'antd'
import { LeftOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { useStoreState } from '../store'

import './Header.scss'

const Header = () => {
  const history = useHistory()
  const location = useLocation()

  const items = useStoreState(s => s.cartState.items)
  const hmac = useStoreState(s => s.sessionState.hmac)

  function handleBack() {
    history.goBack()
  }

  function handleClickCart() {
    history.push(`/cart${location.search}`)
  }

  const isShopHome = /^\/s\/\w+$/.test(location.pathname)

  return !hmac ? (
    <></>
  ) : (
    <header>
      {!isShopHome ? (
        <div className="back" onClick={handleBack}>
          <LeftOutlined />
          <span>Back</span>
        </div>
      ) : (
        <div />
      )}
      <div className="cart-icon" onClick={handleClickCart}>
        <ShoppingCartOutlined />
        <Badge count={items.length} offset={[0, 10]}>
          <span />
        </Badge>
      </div>
    </header>
  )
}

export default Header
