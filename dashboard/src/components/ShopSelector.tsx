import React from 'react'
import { Icon, Menu, Dropdown } from 'antd'

import { useStoreActions } from '../store'
import { Shop } from '../typings'

import './ShopSelector.scss'

interface Props {
  shops: Shop[]
  activeShop: Shop
}

const ShopSelector = ({ shops, activeShop }: Props) => {
  const setActiveShop = useStoreActions(a => a.activeState.setShopId)

  function handleChange({ key }: any) {
    if (activeShop.id !== key) {
      const shop = shops.find(s => s.id === key)
      if (shop) setActiveShop(activeShop.id)
    }
  }

  const menu = (
    <Menu onClick={handleChange}>
      {shops.map((shop: Shop) => (
        <Menu.Item key={shop.id}>{shop.name}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div className="shop-selector">
      <span>{activeShop.name}</span>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <Icon type="caret-down" />
      </Dropdown>
    </div>
  )
}

export default ShopSelector
