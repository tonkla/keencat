import api from '../api'
import { Product } from '../../typings'

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

async function removeByIds(ids: string[]): Promise<boolean> {
  if (ids.length < 1) return false
  const resp = await api.call('/delete-products', { ids })
  return resp?.status === 200
}

export default {
  findByIds,
  create,
  update,
  remove,
  removeByIds,
}
