import React from 'react'
import { useParams } from 'react-router-dom'

const CategoryItem = () => {
  const { id } = useParams()
  return <div>{id}</div>
}
export default CategoryItem
