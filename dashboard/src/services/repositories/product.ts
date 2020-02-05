import api from '../api'
import { Product } from '../../typings'

async function find(id: string) {}

async function findByCategory(categoryId: string): Promise<Product[]> {
  const resp = await api.call('/find-products', { categoryId })
  return resp && resp.data ? resp.data : []
}

async function create(product: Product): Promise<void> {
  await api.call('/create-product', { product })
}

async function update(product: Product) {}

async function remove(product: Product) {}

export default {
  find,
  findByCategory,
  create,
  update,
  remove,
}
