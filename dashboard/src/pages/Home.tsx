import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Card, Layout } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import shopRepository from '../services/repositories/shop'
import { Shop } from '../typings'
// import utils from '../services/utils'

import Loading from '../components/Loading'
import SiderMenu from '../components/SiderMenu'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.scss'

const Home: React.FC = ({ children }) => {
  const [isCollapsed, setCollapse] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [activeShop, setActiveShop] = useState<Shop>()

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const activeShopId = useStoreState(s => s.activeState.shopId)

  const setShops = useStoreActions(a => a.shopState.setShops)
  const setActiveShopId = useStoreActions(a => a.activeState.setShopId)

  useEffect(() => {
    // Note: In development, do not fetch shops everytime the component is mounted
    // if (utils.isDev()) return

    if (!user || shops.length > 0) return
    ;(async () => {
      setLoading(true)
      setShops(await shopRepository.findByOwner(user.firebaseId))
      setLoading(false)
    })()
  }, [user, shops.length, setShops])

  useEffect(() => {
    if (shops.length > 0) {
      if (activeShopId) {
        const activeShop = shops.find(s => s.id === activeShopId)
        if (activeShop) return setActiveShop(activeShop)
      }
      setActiveShop(shops[0])
      setActiveShopId(shops[0].id)
    }
  }, [shops, activeShopId, setActiveShopId])

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
          <Content>
            {isLoading ? (
              <Card>
                <Loading position="center" size="large" />
              </Card>
            ) : (
              children
            )}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  )
}

export default Home
