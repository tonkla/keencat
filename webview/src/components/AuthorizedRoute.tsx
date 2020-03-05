import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

import Home from '../pages/Home'

const AuthorizedRoute = ({ component: Component, ...rest }: any) => {
  const location = useLocation()

  function verify(str: string): boolean {
    if (process.env.NODE_ENV === 'development') return true
    const params = new URLSearchParams(str)
    return (
      params.get('hmac') !== null &&
      params.get('pageId') !== null &&
      params.get('customerId') !== null
    )
  }

  return (
    <Route
      {...rest}
      render={props =>
        verify(location.search) ? (
          <Home>
            <Component {...props} />
          </Home>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  )
}

export default AuthorizedRoute
