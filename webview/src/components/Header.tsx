import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Badge } from 'antd'
import { LeftOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import { useStoreState } from '../store'

import './Header.scss'

const Header = () => {
  const history = useHistory()
  const location = useLocation()

  const items = useStoreState(s => s.cartState.items)
  const session = useStoreState(s => s.sessionState.session)

  function handleBack() {
    history.goBack()
  }

  function handleClickCart() {
    history.push(`/cart${location.search}`)
  }

  function handleClickCustomer() {
    history.push(`/customer${location.search}`)
  }

  const isShopHome = /^\/s\/\w+$/.test(location.pathname)

  return !session ? (
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
      <div className="actions">
        <div className="btn" onClick={handleClickCart}>
          <ShoppingCartOutlined />
          <Badge count={items.length} offset={[0, -5]} dot>
            <span />
          </Badge>
        </div>
        <div className="btn" onClick={handleClickCustomer}>
          <UserOutlined />
        </div>
      </div>
    </header>
  )
}

export default Header
