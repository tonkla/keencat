import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Tag } from 'antd'

import { useStoreState } from '../store'
import api from '../services/api'
import { Category, Product, ProductTypeEnum, ProductChargeTypeEnum } from '../typings'

import Loading from '../components/Loading'

import './ProductList.scss'

const ProductList = () => {
  const [category, setCategory] = useState<Category | null>(null)
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
      setCategory(await api.findCategory(session, cid))
      setProducts(await api.findProducts(session, cid))
    })()
  }, [cid, session])

  function handleClickItem(product: Product) {
    if (product.type === ProductTypeEnum.Service || (product.quantity && product.quantity > 0)) {
      history.push(`/p/${product.id}${location.search}`)
    }
  }

  function displayChargeType(chargeType: string | undefined) {
    switch (chargeType) {
      case ProductChargeTypeEnum.Hourly:
        return '/ Hour'
      case ProductChargeTypeEnum.Daily:
        return '/ Day'
      case ProductChargeTypeEnum.Monthly:
        return '/ Month'
      default:
        return ''
    }
  }

  return !category || !products ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main>
        <div className="content product-list" style={{ height: height > 0 ? height : '95%' }}>
          <h1>{category.name}</h1>
          {products.length < 1 ? (
            <span>There is no available product.</span>
          ) : (
            <ul>
              {products.map(product => (
                <li
                  key={product.id}
                  style={{ width: width > 0 ? (width - 22) / 2 : '48%' }}
                  onClick={() => handleClickItem(product)}
                  className={
                    product.type === ProductTypeEnum.Goods &&
                    product.quantity !== undefined &&
                    product.quantity < 1
                      ? 'unavailable'
                      : ''
                  }
                >
                  <div className="cover">
                    <div
                      className="img"
                      style={{
                        height: 130,
                        width: width > 0 ? (width - 22) / 2 - 10 : 130,
                      }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </div>
                  <div className="details">
                    <div className="name">
                      <span>{product.name}</span>
                    </div>
                    <div className="price">
                      <span>฿{product.price.toLocaleString()}</span>
                      {product.type === ProductTypeEnum.Service && (
                        <span className="charge-type">{displayChargeType(product.charge)}</span>
                      )}
                    </div>
                    {product.type === ProductTypeEnum.Goods &&
                      product.quantity !== undefined &&
                      product.quantity === 0 && (
                        <div className="out-of-stock">
                          <Tag color="red">Out of Stock</Tag>
                        </div>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}

export default ProductList
