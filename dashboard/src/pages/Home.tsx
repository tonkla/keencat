import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Icon, Layout } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import shopRepo from '../services/firebase/firestore/shop'
import { Shop } from '../typings/shop'

import ShopSelector from '../components/ShopSelector'
import SiderMenu from '../components/SiderMenu'
import UserAvatar from '../components/UserAvatar'

import '../styles/Home.scss'

const Home: React.FC = ({ children }) => {
  const [collapsed, setCollapse] = useState(false)

  const setActiveShop = useStoreActions(a => a.activeState.setShop)
  const setShops = useStoreActions(a => a.shopState.setShops)

  const user = useStoreState(s => s.userState.user)
  const activeShop = useStoreState(s => s.activeState.shop)
  const shops = useStoreState(s => s.shopState.shops)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setShops(await shopRepo.findByOwner(user))
    })()
  }, [user, setShops])

  function onShopChanged(s: Shop) {
    if (activeShop && activeShop.id !== s.id) setActiveShop(s)
  }

  function toggle() {
    setCollapse(!collapsed)
  }

  const { Content, Footer, Header } = Layout

  return !user ? (
    <Redirect to="/login" />
  ) : (
    <div className="home-container">
      <Layout>
        <SiderMenu collapsed={collapsed} />
        <Layout>
          <Header>
            <div className="left">
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={toggle}
              />
            </div>
            <div className="right">
              {activeShop && shops.length > 0 && (
                <div className="shop">
                  <ShopSelector
                    shops={shops}
                    activeShop={shops.find((s: Shop) => s.id === activeShop.id)}
                    callback={onShopChanged}
                  />
                </div>
              )}
              <UserAvatar user={user} />
            </div>
          </Header>
          <Content>{children}</Content>
          <Footer>
            Crafted with{' '}
            <span className="love" aria-label="love" role="img">
              😻
            </span>{' '}
            by <a href="https://keencat.co">KeenCAT</a>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Home
