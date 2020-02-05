import api from '../api'
import { Category } from '../../typings'

async function find(id: string) {}

async function findByShop(shopId: string): Promise<Category[]> {
  const resp = await api.call('/find-categories-by-shop', { shopId })
  return resp && resp.data ? resp.data : []
}

async function create(category: Category) {
  await api.call('/create-category', { category })
}

async function update(category: Category) {}

async function remove(category: Category) {}

export default {
  find,
  findByShop,
  create,
  update,
  remove,
}
