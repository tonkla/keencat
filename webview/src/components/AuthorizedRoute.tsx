import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

import Home from '../pages/Home'

const AuthorizedRoute = ({ component: Component, ...rest }: any) => {
  const location = useLocation()

  function verifyToken(str: string): boolean {
    if (process.env.NODE_ENV === 'development') return true
    const token = str.split('?t=')
    if (token.length > 1) {
      // TODO: verify token[1]
      return true
    }
    return false
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
