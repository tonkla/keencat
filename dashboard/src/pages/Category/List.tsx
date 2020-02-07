import React from 'react'
import { Link } from 'react-router-dom'

import { Category } from '../../typings/category'

interface Params {
  categories: Category[]
}

const CategoryList = ({ categories }: Params) => {
  return (
    <ul>
      {categories.map(c => (
        <li key={c.id}>
          <Link to={`/categories/${c.id}`}>
            {c.name} ({c.productIds.length})
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default CategoryList
