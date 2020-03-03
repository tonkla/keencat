import React from 'react'
import { Button } from 'antd'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const Home: React.FC = ({ children }) => {
  const location = useLocation()

  function handleSubmit() {
    if (!(window as any).MessengerExtensions) return
    ;(window as any).MessengerExtensions.requestCloseBrowser(
      async function success() {
        const url = process.env.REACT_APP_WEBHOOK_URL || ''
        if (url === '') return
        try {
          const authorization = process.env.REACT_APP_PUBLIC_TOKEN || ''
          const params = new URLSearchParams(location.search)
          const pageId = params.get('pageId')
          const customerId = params.get('customerId')
          await axios.create({ headers: { authorization } }).post(url, { pageId, customerId })
        } catch (e) {}
      },
      function error(err: any) {}
    )
  }

  return (
    <div>
      {children}
      <div>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default Home
