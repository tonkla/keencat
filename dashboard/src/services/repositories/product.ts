import api from '../api'
import { Category, Product } from '../../typings'

async function find(id: string): Promise<Product | null> {
  const resp = await api.call('/find-product', { id })
  return resp && resp.data ? resp.data : null
}

async function findByIds(ids: string[]): Promise<Product[]> {
  if (ids.length < 1) return []
  const resp = await api.call('/find-products', { ids })
  return resp && resp.data ? resp.data : []
}

async function create(product: Product): Promise<boolean> {
  const resp = await api.call('/create-product', { product })
  return resp?.status === 200
}

async function update(product: Product): Promise<boolean> {
  const resp = await api.call('/update-product', { product })
  return resp?.status === 200
}

async function remove(product: Product): Promise<boolean> {
  const resp = await api.call('/delete-product', { product })
  return resp?.status === 200
}

async function removeByCategory(category: Category): Promise<boolean> {
  if (category.productIds.length < 1) return false
  const resp = await api.call('/delete-products', { category })
  return resp?.status === 200
}

export default {
  find,
  findByIds,
  create,
  update,
  remove,
  removeByCategory,
}
