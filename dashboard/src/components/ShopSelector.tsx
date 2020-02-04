import React from 'react'
import { Icon, Menu, Dropdown } from 'antd'

import { Shop } from '../typings'

interface ShopSelectorProps {
  shops: Shop[]
  activeShop?: Shop
  callback(shopId: string): void
}

const ShopSelector = (props: ShopSelectorProps) => {
  const menu = (
    <Menu
      onClick={({ key }: any) => {
        props.callback(key)
      }}
    >
      {props.shops.map((shop: Shop) => (
        <Menu.Item key={shop.id}>{shop.name}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {props.activeShop && <span style={{ paddingLeft: 5 }}>{props.activeShop.name}</span>}
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <Icon type="caret-down" style={{ fontSize: 15, paddingLeft: 5 }} />
      </Dropdown>
    </div>
  )
}
export default ShopSelector
