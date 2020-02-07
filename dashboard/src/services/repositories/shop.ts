import api from '../api'
import { Shop, User } from '../../typings'

async function find(id: string) {}

async function findByOwner(owner: User): Promise<Shop[]> {
  const resp = await api.call('/find-shops', { ownerId: owner.firebaseId })
  return resp && resp.data ? resp.data : []
}

async function create(shop: Shop): Promise<void> {
  await api.call('/create-shop', { shop })
}

async function update(shop: Shop) {
  await api.call('/update-shop', { shop })
}

async function remove(shop: Shop) {
  await api.call('/delete-shop', { shop })
}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
