import api from '../api'
import { Shop, User } from '../../typings'

async function find(id: string) {}

async function findByOwner(owner: User): Promise<Shop[]> {
  const resp = await api.call('/find-shops-by-owner', { owner })
  return resp && resp.data ? resp.data : []
}

async function create(shop: Shop): Promise<void> {
  await api.call('/create-shop', { shop })
}

async function update(shop: Shop) {}

async function remove(shop: Shop) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
