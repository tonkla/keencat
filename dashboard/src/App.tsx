import React from 'react'
import { StoreProvider } from 'easy-peasy'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// import configureStore from './store'
// import AuthorizedRoute from './components/AuthorizedRoute'
import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import ShopIndex from './pages/Shop'
// import CategoryIndex from './pages/Category'
// import ProductIndex from './pages/Product'
// import InboxIndex from './pages/Inbox'
// import OrderIndex from './pages/Order'

import store from './store'

import 'antd/dist/antd.css'
import './styles/App.scss'

// const { store, persistor } = configureStore()

// const App: React.FC = () => {
//   return (
// <Provider store={store}>
//   <PersistGate loading={null} persistor={persistor}>
//     <Router>
//       <Route path="/login" component={Login} />
//       {/* <AuthorizedRoute path="/" exact component={Dashboard} />
//       <AuthorizedRoute path="/shop" component={ShopIndex} />
//       <AuthorizedRoute path="/category" component={CategoryIndex} />
//       <AuthorizedRoute path="/product" component={ProductIndex} />
//       <AuthorizedRoute path="/inbox" component={InboxIndex} />
//       <AuthorizedRoute path="/order" component={OrderIndex} /> */}
//     </Router>
//   </PersistGate>
// </Provider>
//   )
// }

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <Route path="/login" component={Login} />
      {/* <AuthorizedRoute path="/" exact component={Dashboard} />
      <AuthorizedRoute path="/shop" component={ShopIndex} />
      <AuthorizedRoute path="/category" component={CategoryIndex} />
      <AuthorizedRoute path="/product" component={ProductIndex} />
      <AuthorizedRoute path="/inbox" component={InboxIndex} />
      <AuthorizedRoute path="/order" component={OrderIndex} /> */}
    </Router>
  </StoreProvider>
)

export default App
