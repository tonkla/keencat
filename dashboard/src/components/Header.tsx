import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Icon, Layout, Select } from 'antd'

import { useStoreActions } from '../store'
import { Shop, User } from '../typings'
import { PATH_SHOP } from '../constants'

import UserAvatar from './UserAvatar'
import './Header.scss'

interface Props {
  activeShop?: Shop
  shops: Shop[]
  isCollapsed: boolean
  setCollapse: Function
  user: User
}

const Header = (props: Props) => {
  const setActiveShop = useStoreActions(a => a.activeState.setShopId)
  const setCreateShop = useStoreActions(a => a.sharedState.setCreateShop)

  const history = useHistory()

  const { activeShop, shops, isCollapsed, setCollapse, user } = props

  function handleChangeShop(shopId: string) {
    if (activeShop && activeShop.id !== shopId) {
      const shop = shops.find(s => s.id === shopId)
      if (shop) setActiveShop(activeShop.id)
    }
  }

  function handleCreateShop() {
    setCreateShop(true)
    history.replace(PATH_SHOP)
  }

  return (
    <Layout.Header className="header">
      <div className="left">
        <Icon
          className="trigger"
          type={isCollapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={() => setCollapse(!isCollapsed)}
        />
        {activeShop && shops.length > 0 && (
          <div>
            <Select defaultValue={activeShop.name} onChange={handleChangeShop}>
              {shops.map(shop => (
                <Select.Option key={shop.id} value={shop.id}>
                  {shop.name}
                </Select.Option>
              ))}
            </Select>
            <Button
              className="btn-create-shop"
              icon="plus"
              shape="circle"
              title="Add Shop"
              onClick={handleCreateShop}
            />
          </div>
        )}
      </div>
      <div className="right">
        <UserAvatar user={user} />
      </div>
    </Layout.Header>
  )
}

export default Header
