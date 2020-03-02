import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import api from '../services/api'
import { Category } from '../typings'

import Loading from '../components/Loading'

import './CategoryList.scss'

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[] | null>(null)

  const location = useLocation()
  const { sid } = useParams()

  useEffect(() => {
    if (!sid) return
    ;(async () => {
      setCategories(await api.findCategories(sid))
    })()
  }, [sid])

  return !categories ? (
    <Loading />
  ) : (
    <ul>
      <span>Categories</span>
      {categories.map((category, idx) => (
        <li key={idx}>
          <Link to={`/c/${category.id}/p${location.search}`}>{category.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default CategoryList
