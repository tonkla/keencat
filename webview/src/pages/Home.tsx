import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useStoreActions } from '../store'
import { Session } from '../typings'

import Header from '../components/Header'
import './Home.scss'

const Home: React.FC = ({ children }) => {
  const location = useLocation()

  const setSession = useStoreActions(a => a.sessionState.set)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const session: Session = {
      hmac: params.get('hmac') || '',
      pageId: params.get('pageId') || '',
      customerId: params.get('customerId') || '',
    }
    setSession(session)
  }, [location.search, setSession])

  return (
    <div className="container" id="container">
      <Header />
      {children}
    </div>
  )
}

export default Home
