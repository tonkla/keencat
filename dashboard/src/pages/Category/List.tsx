import React from 'react'
import { Link } from 'react-router-dom'

import { Category } from '../../typings/category'

interface Props {
  categories: Category[]
}

const CategoryList = ({ categories }: Props) => {
  return (
    <ul className="categories">
      {categories.map(c => (
        <li key={c.id} className="category">
          <Link to={`/categories/${c.id}`}>
            {c.name} ({c.productIds.length})
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default CategoryList
