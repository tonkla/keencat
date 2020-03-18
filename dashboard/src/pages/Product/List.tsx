import React from 'react'
import { Link } from 'react-router-dom'
import { Tag } from 'antd'

import { Product } from '../../typings/product'
import { PATH_PRODUCT } from '../../constants'

interface Props {
  products: Product[]
}

const ProductList = ({ products }: Props) => {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.images && product.images.length > 0 ? (
            <Link to={`${PATH_PRODUCT}/${product.id}`}>
              <div className="cover">
                <img src={product.images[0]} alt={product.name} />
              </div>
            </Link>
          ) : (
            <Link to={`${PATH_PRODUCT}/${product.id}`}>
              <div className="cover">
                <span>No Image</span>
              </div>
            </Link>
          )}
          <div className="info">
            <Link to={`${PATH_PRODUCT}/${product.id}`}>
              {product.name}
              {product.isActive ? (
                <Tag color="green">Available</Tag>
              ) : (
                <Tag color="red">Unavailable</Tag>
              )}
            </Link>
            <div className="details">
              <span className="price">฿{product.price.toLocaleString()}</span>
              <span className="quantity">( {product.quantity || 0} left )</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ProductList
