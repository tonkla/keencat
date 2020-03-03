import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

import Home from '../pages/Home'

const AuthorizedRoute = ({ component: Component, ...rest }: any) => {
  const location = useLocation()

  function verifyToken(str: string): boolean {
    if (process.env.NODE_ENV === 'development') return true
    const params = new URLSearchParams(str)
    return params.get('token') === process.env.REACT_APP_PUBLIC_TOKEN
  }

  return (
    <Route
      {...rest}
      render={props =>
        verifyToken(location.search) ? (
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
