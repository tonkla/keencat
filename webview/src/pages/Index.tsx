import React from 'react'
import { Link } from 'react-router-dom'

const Index = () => {
  return process.env.NODE_ENV === 'development' ? (
    <div>
      <ul>
        <li>
          <Link to="/s/xdaEuLfs2is68FK1?token=dev&pageId=123&customerId=456">Shop</Link>
        </li>
        <li>
          <Link to="/c/D9T0u10vkSFtvlkd/p?token=dev&pageId=123&customerId=456">Products</Link>
        </li>
        <li>
          <Link to="/p/k3ZqzOy0LBRenGoB?token=dev&pageId=123&customerId=456">Product</Link>
        </li>
      </ul>
    </div>
  ) : (
    <></>
  )
}

export default Index
