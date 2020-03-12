import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { useStoreState } from '../store'
import api from '../services/api'
import { Product } from '../typings'

import Loading from '../components/Loading'

import './ProductList.scss'

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const history = useHistory()
  const location = useLocation()
  const { cid } = useParams()

  const session = useStoreState(s => s.sessionState.session)

  useEffect(() => {
    if (!(cid && session)) return
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 40 : 0
    const width = elMain ? elMain.offsetWidth : 0
    setHeight(height)
    setWidth(width)
    ;(async () => {
      setProducts(await api.findProducts(session, cid))
    })()
  }, [cid, session])

  return !products ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main>
        <div className="content product-list" style={{ height: height > 0 ? height : '95%' }}>
          <h1>Products</h1>
          <ul>
            {products.map(product => (
              <li
                key={product.id}
                style={{ width: width > 0 ? (width - 22) / 2 : '48%' }}
                onClick={() => history.push(`/p/${product.id}${location.search}`)}
              >
                <div className="cover">
                  <div
                    className="img"
                    style={{
                      height: 130,
                      width: width > 0 ? (width - 22) / 2 - 10 : 130,
                      backgroundImage:
                        product.images && product.images.length > 0
                          ? `url('${product.images[0]}')`
                          : 'none',
                    }}
                  />
                </div>
                <div className="details">
                  <div className="name">
                    <span>{product.name}</span>
                  </div>
                  <div className="price">
                    <span>฿{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export default ProductList
