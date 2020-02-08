import React from 'react'
import { Button, Icon, Layout } from 'antd'

import { Shop, User } from '../typings'

import ShopSelector from './ShopSelector'
import UserAvatar from './UserAvatar'
import './Header.scss'

interface Props {
  isCollapsed: boolean
  setCollapse: Function
  shops: Shop[]
  activeShop?: Shop
  user: User
}

const Header = ({ isCollapsed, setCollapse, shops, activeShop, user }: Props) => {
  return (
    <Layout.Header className="header">
      <div className="left">
        <Icon
          className="trigger"
          type={isCollapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={() => setCollapse(!isCollapsed)}
        />
        {activeShop && shops.length > 0 && <ShopSelector shops={shops} activeShop={activeShop} />}
      </div>
      <div className="right">
        <Button icon="plus" onClick={() => {}}>
          Create Shop
        </Button>
        <UserAvatar user={user} />
      </div>
    </Layout.Header>
  )
}

export default Header
