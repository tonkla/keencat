import React from 'react'
import { useParams } from 'react-router-dom'

const ProductItem = () => {
  const { id } = useParams()
  return <div>{id}</div>
}
export default ProductItem
