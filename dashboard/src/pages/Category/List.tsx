import React from 'react'
import { Link } from 'react-router-dom'

import { Category } from '../../typings/category'
import { PATH_CATEGORY } from '../../constants'

interface Props {
  categories: Category[]
}

const CategoryList = ({ categories }: Props) => {
  return (
    <ul className="categories">
      {categories.map(c => (
        <li key={c.id}>
          <Link to={`${PATH_CATEGORY}/${c.id}`}>
            {c.name} ({c.productIds.length})
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default CategoryList
