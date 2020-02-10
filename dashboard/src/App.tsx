import React from 'react'
import { StoreProvider } from 'easy-peasy'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import store from './store'

import AuthorizedRoute from './components/AuthorizedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ShopIndex from './pages/Shop'
import CategoryItem from './pages/CategoryItem'
import ProductItem from './pages/ProductItem'
import InboxIndex from './pages/Inbox'
import OrderIndex from './pages/Order'
import { PATH_SHOP } from './constants'

import 'antd/dist/antd.css'
import './App.scss'

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <AuthorizedRoute path="/" exact component={Dashboard} />
        <AuthorizedRoute path={PATH_SHOP} exact component={ShopIndex} />
        <AuthorizedRoute path="/categories/:id" component={CategoryItem} />
        <AuthorizedRoute path="/products/:id" component={ProductItem} />
        <AuthorizedRoute path="/inbox" exact component={InboxIndex} />
        <AuthorizedRoute path="/orders" exact component={OrderIndex} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </StoreProvider>
)

export default App
