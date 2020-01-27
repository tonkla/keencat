import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useStoreState } from '../store'
import Home from '../pages/Home'

const AuthorizedRoute = ({ component: Component, ...rest }: any) => {
  const user = useStoreState(s => s.userState.user)
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Home>
            <Component {...props} />
          </Home>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}

export default AuthorizedRoute
