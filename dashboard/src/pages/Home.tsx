import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Icon, Layout } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import shopRepository from '../services/repositories/shop'
import utils from '../services/utils'
import { Shop } from '../typings/shop'

import Loading from '../components/Loading'
import ShopSelector from '../components/ShopSelector'
import SiderMenu from '../components/SiderMenu'
import UserAvatar from '../components/UserAvatar'

import './Home.scss'

const Home: React.FC = ({ children }) => {
  const [collapsed, setCollapse] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const setActiveShop = useStoreActions(a => a.activeState.setShopId)
  const setShops = useStoreActions(a => a.shopState.setShops)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  useEffect(() => {
    if (!user) return
    if (utils.isDev() && shops.length > 0) {
      if (!activeShop) setActiveShop(shops[0].id)
      return
    }
    ;(async () => {
      setLoading(true)
      const _shops = await shopRepository.findByOwner(user)
      setShops(_shops)
      if (!activeShop && _shops.length > 0) setActiveShop(_shops[0].id)
      setLoading(false)
    })()
  }, [user, shops, activeShop, setShops, setActiveShop])

  function onShopChanged(shopId: string) {
    if (activeShop && activeShop.id !== shopId) {
      const shop = shops.find(s => s.id === shopId)
      if (shop) setActiveShop(activeShop.id)
    }
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
          <Content>{isLoading ? <Loading position="center" /> : children}</Content>
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
