import React from 'react'
import { Link } from 'react-router-dom'

import { Product } from '../../typings/product'
import { PATH_PRODUCT } from '../../constants'

interface Props {
  products: Product[]
}

const ProductList = ({ products }: Props) => {
  return (
    <ul className="list">
      {products.map(p => (
        <li key={p.id} className="item">
          <Link to={`${PATH_PRODUCT}/${p.id}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default ProductList
