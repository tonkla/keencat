import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Layout, Select } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons'

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
      if (shop) setActiveShop(shop.id)
    }
  }

  function handleCreateShop() {
    setCreateShop(true)
    history.replace(PATH_SHOP)
  }

  return (
    <Layout.Header className="header">
      <div className="left">
        {isCollapsed ? (
          <MenuUnfoldOutlined className="trigger" onClick={() => setCollapse(false)} />
        ) : (
          <MenuFoldOutlined className="trigger" onClick={() => setCollapse(true)} />
        )}
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
              icon={<PlusOutlined />}
              shape="circle"
              title="Create Shop"
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
