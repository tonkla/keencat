import api from '../api'
import { Category, Shop } from '../../typings'

async function findByIds(ids: string[]): Promise<Category[]> {
  if (ids.length < 1) return []
  const resp = await api.call('/find-categories', { ids })
  return resp && resp.data ? resp.data : []
}

async function create(category: Category): Promise<boolean> {
  const resp = await api.call('/create-category', { category })
  return resp?.status === 200
}

async function update(category: Category): Promise<boolean> {
  const resp = await api.call('/update-category', { category })
  return resp?.status === 200
}

async function remove(category: Category): Promise<boolean> {
  const resp = await api.call('/delete-category', { category })
  return resp?.status === 200
}

async function removeByShop(shop: Shop): Promise<boolean> {
  if (shop.categoryIds.length < 1) return false
  const resp = await api.call('/delete-categories', { shop })
  return resp?.status === 200
}

export default {
  findByIds,
  create,
  update,
  remove,
  removeByShop,
}
