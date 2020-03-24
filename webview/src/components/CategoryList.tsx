import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { TagsOutlined } from '@ant-design/icons'

import { useStoreState } from '../store'
import api from '../services/api'
import { Category } from '../typings'

import Loading from './Loading'

import './CategoryList.scss'

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[] | null>(null)

  const location = useLocation()
  const { sid } = useParams()

  const session = useStoreState(s => s.sessionState.session)

  useEffect(() => {
    if (!(sid && session)) return
    ;(async () => {
      setCategories(await api.findCategories(session, sid))
    })()
  }, [sid, session])

  return !categories ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <ul className="category-list">
      <h1>Categories</h1>
      {categories.map(category => (
        <li key={category.id}>
          <Link to={`/c/${category.id}/p${location.search}`}>
            <TagsOutlined />
            <span>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default CategoryList
