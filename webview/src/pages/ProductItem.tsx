import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, InputNumber } from 'antd'

import api from '../services/api'
import { Product } from '../typings'

import Loading from '../components/Loading'

import './ProductItem.scss'

const ProductItem = () => {
  const [product, setProduct] = useState<Product>()
  const [qty, setQty] = useState(1)

  const { pid } = useParams()

  useEffect(() => {
    if (!pid) return
    ;(async () => {
      const product = await api.findProduct(pid)
      if (product) setProduct(product)
    })()
  }, [pid])

  function handleChangeQuantity(value: number | undefined) {
    const regexNumeric = /(^\d+$|^$)/
    if (value && regexNumeric.test(value.toString())) {
      setQty(value)
    } else {
      setQty(1)
    }
  }

  function handleSubmit() {
    console.log(qty)
  }

  return !product ? (
    <Loading />
  ) : (
    <div className="product">
      <h1>{product.name}</h1>
      <div>{product.description}</div>
      <div>
        <span>Price: </span>
        <span>{product.price}</span>
      </div>
      <div>
        <span>Quantity: </span>
        <span>{product.quantity}</span>
      </div>
      {product.images &&
        product.images.map((img, idx) => (
          <div key={idx} className="image" style={{ backgroundImage: `url(${img})` }} />
        ))}
      <div className="form">
        <InputNumber
          min={1}
          max={product.quantity}
          defaultValue={1}
          value={qty}
          onChange={handleChangeQuantity}
          disabled={product.quantity < 1}
        />
        <Button type="primary" onClick={handleSubmit} disabled={product.quantity < 1}>
          Buy
        </Button>
      </div>
    </div>
  )
}

export default ProductItem
