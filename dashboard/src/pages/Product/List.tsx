import React from 'react'
import { Link } from 'react-router-dom'

import { Product } from '../../typings/product'

interface Props {
  products: Product[]
}

const ProductList = ({ products }: Props) => {
  return (
    <ul className="list">
      {products.map(p => (
        <li key={p.id} className="item">
          <Link to={`/products/${p.id}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default ProductList
