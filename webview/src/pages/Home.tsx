import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useStoreActions } from '../store'

import Header from '../components/Header'
import './Home.scss'

const Home: React.FC = ({ children }) => {
  const location = useLocation()

  const setHmac = useStoreActions(a => a.sessionState.setHmac)
  const setPageId = useStoreActions(a => a.sessionState.setPageId)
  const setCustomerId = useStoreActions(a => a.sessionState.setCustomerId)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const hmac = params.get('hmac')
    const pageId = params.get('pageId')
    const customerId = params.get('customerId')
    if (hmac) setHmac(hmac)
    if (pageId) setPageId(pageId)
    if (customerId) setCustomerId(customerId)
  }, [location.search, setHmac, setPageId, setCustomerId])

  return (
    <div className="container" id="container">
      <Header />
      {children}
    </div>
  )
}

export default Home
