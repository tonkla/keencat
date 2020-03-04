import React from 'react'
import { StoreProvider } from 'easy-peasy'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import store from './store'

import AuthorizedRoute from './components/AuthorizedRoute'
import Cart from './pages/Cart'
import Index from './pages/Index'
import ProductItem from './pages/ProductItem'
import ProductList from './pages/ProductList'
import Shop from './pages/Shop'

import 'antd/dist/antd.css'
import './App.scss'

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <Switch>
        <Route path="/" exact component={Index} />
        <AuthorizedRoute path="/s/:sid" exact component={Shop} />
        <AuthorizedRoute path="/c/:cid/p" exact component={ProductList} />
        <AuthorizedRoute path="/p/:pid" exact component={ProductItem} />
        <AuthorizedRoute path="/cart" exact component={Cart} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </StoreProvider>
)

export default App
