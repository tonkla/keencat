import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Layout } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import shopRepository from '../services/repositories/shop'
import utils from '../services/utils'

import Loading from '../components/Loading'
import SiderMenu from '../components/SiderMenu'

import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.scss'

const Home: React.FC = ({ children }) => {
  const [isCollapsed, setCollapse] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const setActiveShop = useStoreActions(a => a.activeState.setShopId)
  const setShops = useStoreActions(a => a.shopState.setShops)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  // Note: DO NOT combine these two useEffects, will cause infinite loop with shops/setShops
  useEffect(() => {
    if (utils.isDev()) return
    if (!user) return
    ;(async () => {
      setLoading(true)
      setShops(await shopRepository.findByOwner(user.firebaseId))
      setLoading(false)
    })()
  }, [user, setShops])

  useEffect(() => {
    if (!activeShop && shops.length > 0) setActiveShop(shops[0].id)
  }, [activeShop, shops, setActiveShop])

  const { Content } = Layout

  return !user ? (
    <Redirect to="/login" />
  ) : (
    <div className="home-container">
      <Layout>
        <SiderMenu isCollapsed={isCollapsed} activeShop={activeShop} />
        <Layout>
          <Header
            shops={shops}
            activeShop={activeShop}
            isCollapsed={isCollapsed}
            setCollapse={setCollapse}
            user={user}
          />
          <Content>{isLoading ? <Loading position="center" size="large" /> : children}</Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  )
}

export default Home
