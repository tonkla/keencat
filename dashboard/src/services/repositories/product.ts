import api from '../api'
import { Product } from '../../typings'

async function findByIds(ids: string[]): Promise<Product[]> {
  const resp = await api.call('/find-categories', { ids })
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

export default {
  findByIds,
  create,
  update,
  remove,
}
