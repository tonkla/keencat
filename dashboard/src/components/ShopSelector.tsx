import React from 'react'
import { Icon, Menu, Dropdown } from 'antd'

import { Shop } from '../typings'

type ShopSelectorProps = {
  shops: Shop[]
  activeShop?: Shop
  callback(shop: Shop): void
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
      }}
    >
      <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
        <Icon type="shop" />
      </Dropdown>
      {props.activeShop && <span style={{ paddingLeft: 5 }}>{props.activeShop.name}</span>}
    </div>
  )
}
export default ShopSelector
