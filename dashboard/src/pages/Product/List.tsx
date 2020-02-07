import React from 'react'
import { Link } from 'react-router-dom'

import { Product } from '../../typings/product'

interface Params {
  products: Product[]
}

const ProductList = ({ products }: Params) => {
  return (
    <ul className="products">
      {products.map(p => (
        <li key={p.id} className="product">
          <Link to={`/products/${p.id}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default ProductList
