import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { useStoreState } from '../store'
import api from '../services/api'
import { Product, RequestHeader } from '../typings'

import Loading from '../components/Loading'

import './ProductList.scss'

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null)

  const location = useLocation()
  const { cid } = useParams()

  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    if (!(cid && hmac && pageId && customerId)) return
    ;(async () => {
      const headers: RequestHeader = {
        hmac,
        pageId,
        customerId,
      }
      setProducts(await api.findProducts(headers, cid))
    })()
  }, [cid, hmac, pageId, customerId])

  return !products ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main>
        <ul className="product-list">
          <span>Products</span>
          {products.map((product, idx) => (
            <li key={idx}>
              <Link to={`/p/${product.id}${location.search}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default ProductList
