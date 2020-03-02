import React from 'react'
import { Link } from 'react-router-dom'

const Index = () => {
  return process.env.NODE_ENV === 'development' ? (
    <div>
      <ul>
        <li>
          <Link to="/s/xdaEuLfs2is68FK1?t=dev">Shop</Link>
        </li>
        <li>
          <Link to="/s/xdaEuLfs2is68FK1/c?t=dev">Categories</Link>
        </li>
        <li>
          <Link to="/c/D9T0u10vkSFtvlkd/p?t=dev">Products</Link>
        </li>
        <li>
          <Link to="/p/k3ZqzOy0LBRenGoB?t=dev">Product</Link>
        </li>
      </ul>
    </div>
  ) : (
    <></>
  )
}

export default Index
