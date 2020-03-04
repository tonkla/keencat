import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useStoreActions } from '../store'

import Header from '../components/Header'
import './Home.scss'

const Home: React.FC = ({ children }) => {
  const location = useLocation()

  const setPageId = useStoreActions(a => a.sessionState.setPageId)
  const setCustomerId = useStoreActions(a => a.sessionState.setCustomerId)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const pageId = params.get('pageId')
    const customerId = params.get('customerId')
    if (pageId) setPageId(pageId)
    if (customerId) setCustomerId(customerId)
  }, [location.search, setPageId, setCustomerId])

  return (
    <div className="container" id="container">
      <Header />
      {children}
    </div>
  )
}

export default Home
