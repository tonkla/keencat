import React from 'react'
import { StoreProvider } from 'easy-peasy'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import store from './store'

import AuthorizedRoute from './components/AuthorizedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ShopIndex from './pages/Shop'
import CategoryIndex from './pages/Category'
import ProductIndex from './pages/Product'
import InboxIndex from './pages/Inbox'
import OrderIndex from './pages/Order'

import 'antd/dist/antd.css'
import './App.scss'

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <AuthorizedRoute path="/" exact component={Dashboard} />
        <AuthorizedRoute path="/category" component={CategoryIndex} />
        <AuthorizedRoute path="/inbox" component={InboxIndex} />
        <AuthorizedRoute path="/order" component={OrderIndex} />
        <AuthorizedRoute path="/product" component={ProductIndex} />
        <AuthorizedRoute path="/shop" component={ShopIndex} />
      </Switch>
    </Router>
  </StoreProvider>
)

export default App
