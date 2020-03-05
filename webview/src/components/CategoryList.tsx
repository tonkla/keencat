import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { TagsOutlined } from '@ant-design/icons'

import { useStoreState } from '../store'
import api from '../services/api'
import { Category, RequestHeader } from '../typings'

import Loading from './Loading'

import './CategoryList.scss'

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[] | null>(null)

  const location = useLocation()
  const { sid } = useParams()

  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    if (!(sid && hmac && pageId && customerId)) return
    ;(async () => {
      const headers: RequestHeader = {
        hmac,
        pageId,
        customerId,
      }
      setCategories(await api.findCategories(headers, sid))
    })()
  }, [sid, hmac, pageId, customerId])

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
            <span>
              {category.name} ({category.productIds.length})
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default CategoryList
