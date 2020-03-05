import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Badge } from 'antd'
import { LeftOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { useStoreState } from '../store'

import './Header.scss'

const Header = () => {
  const [isAuth, setIsAuth] = useState(false)

  const history = useHistory()
  const location = useLocation()

  const items = useStoreState(s => s.cartState.items)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setIsAuth(
      params.get('hmac') !== null &&
        params.get('pageId') !== null &&
        params.get('customerId') !== null
    )
  }, [location.search])

  function handleBack() {
    history.goBack()
  }

  function handleClickCart() {
    history.push('/cart')
  }

  const isShopHome = /^\/s\/\w+$/.test(location.pathname)

  return (
    <header>
      {!isShopHome && (
        <div className="back" onClick={handleBack}>
          <LeftOutlined />
          <span>Back</span>
        </div>
      )}
      {isAuth && (
        <div className="cart-icon" onClick={handleClickCart}>
          <ShoppingCartOutlined />
          <Badge count={items.length} offset={[5, 10]}>
            <span />
          </Badge>
        </div>
      )}
    </header>
  )
}

export default Header
