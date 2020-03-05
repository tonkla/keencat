import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { useStoreState } from '../store'
import api from '../services/api'
import { Product, RequestHeader } from '../typings'

import Loading from '../components/Loading'

import './ProductList.scss'

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [height, setHeight] = useState()

  const location = useLocation()
  const { cid } = useParams()

  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    if (!(cid && hmac && pageId && customerId)) return
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 35 : '95%'
    setHeight(height)
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
        <ul className="content product-list" style={{ height }}>
          <h1>Products</h1>
          {products.map(product => (
            <li key={product.id}>
              <Link to={`/p/${product.id}${location.search}`}>
                <div
                  className="cover"
                  style={{
                    backgroundImage:
                      product.images && product.images.length > 0
                        ? `url(${product.images[0]})`
                        : 'none',
                  }}
                />
              </Link>
              <div className="details">
                <Link to={`/p/${product.id}${location.search}`}>
                  <span>{product.name}</span>
                </Link>
                <div className="info">
                  <div>
                    <label>Price:</label>
                    <span>{product.price}</span>
                  </div>
                  <div>
                    <label>Quantity:</label>
                    <span>{product.quantity}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default ProductList
