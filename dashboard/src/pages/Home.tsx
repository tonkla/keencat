import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Icon, Layout } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import Shop from '../typings/shop'

import ShopSelector from '../components/ShopSelector'
import SiderMenu from '../components/SiderMenu'
import UserAvatar from '../components/UserAvatar'

import '../styles/Home.scss'

const { Content, Footer, Header } = Layout

const Home: React.FC = ({ children }) => {
  const setActiveShop = useStoreActions(a => a.activeState.setShop)

  const user = useStoreState(s => s.userState.user)
  const shop = useStoreState(s => s.activeState.shop)
  const shops = useStoreState(s => s.shopState.shops)

  const onShopChanged = (s: Shop) => {
    if (shop && shop.id !== s.id) setActiveShop(s)
  }

  const [collapsed, setCollapse] = useState(false)
  const toggle = () => {
    setCollapse(!collapsed)
  }

  return user && shop ? (
    <div className="home-container">
      <Layout>
        <SiderMenu collapsed={collapsed} />
        <Layout>
          <Header>
            <div className="wl">
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={toggle}
              />
            </div>
            <div className="wr">
              {shops.length > 0 && (
                <div className="shop">
                  <ShopSelector
                    shops={shops}
                    activeShop={shops.find((s: Shop) => s.id === shop.id)}
                    callback={onShopChanged}
                  />
                </div>
              )}
              <UserAvatar user={user} />
            </div>
          </Header>
          <Content>{children}</Content>
          <Footer style={{ textAlign: 'center' }}>SleepyCat ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    </div>
  ) : (
    <Redirect to="/login" />
  )
}

export default Home
