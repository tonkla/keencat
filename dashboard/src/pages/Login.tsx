import React, { useCallback, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Icon } from 'antd'

// import firestore from '../services/firebase/firestore'
import facebook from '../services/facebook'
import { useStoreState, useStoreActions } from '../store'
// import { AppState, Page, Shop, Category } from '../typings'

import '../styles/Login.scss'

const Login: React.FC = () => {
  const [isLoading, setLoading] = useState(false)

  const setUser = useStoreActions(a => a.userState.set)
  const user = useStoreState(s => s.userState.user)

  const handleLogIn = useCallback(async () => {
    setLoading(true)
    if (await facebook.isAuthenticated()) {
      const u = await facebook.getUserInfo()
      if (u) {
        setUser(u)
        // dispatch({ type: 'setUser', payload: { user } })
        // const pages: Page[] = await facebook.getPages()
        // dispatch({ type: 'setPages', payload: { pages } })
        // const shops: Shop[] = await api.getShops()
        // dispatch({ type: 'setShops', payload: { shops } })
        // if (shops.length > 0) {
        //   dispatch({
        //     type: 'setActiveShopId',
        //     payload: { shopId: shops[0].id },
        //   })
        //   const categories: Category[] = await api.getCategories(shops[0].id)
        //   dispatch({ type: 'setCategories', payload: { categories } })
        setLoading(false)
      }
    } else {
      await facebook.logIn()
    }
  }, [setUser])

  return user ? (
    <Redirect to="/" />
  ) : isLoading ? (
    <div className="login-container">
      <div className="col">
        <Icon type="loading" style={{ fontSize: '50px', color: 'rgba(0,0,0,0.4)' }} />
      </div>
    </div>
  ) : (
    <div className="login-container">
      <div className="col">
        <div className="text-name">
          <span>SleepyCat</span>
        </div>
        <div className="text-desc">
          <span>Pet Care Booking via Facebook Messenger</span>
        </div>
        <div onClick={handleLogIn} className="fb-btn-login">
          <div className="icon">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              viewBox="0 0 216 216"
              className="_5h0m"
              color="#FFFFFF"
            >
              <path
                fill="#FFFFFF"
                d="M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
            11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
            11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
            15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
            11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"
              />
            </svg>
          </div>
          <div className="text">
            <span>Log in With Facebook</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
