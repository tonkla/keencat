import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import api from '../services/api'
import { Product } from '../typings'

import Loading from '../components/Loading'

import './ProductList.scss'

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null)

  const location = useLocation()
  const { cid } = useParams()

  useEffect(() => {
    if (!cid) return
    ;(async () => {
      setProducts(await api.findProducts(cid))
    })()
  }, [cid])

  return !products ? (
    <div className="mt40">
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
