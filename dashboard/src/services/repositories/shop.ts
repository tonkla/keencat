import api from '../api'
import { Shop } from '../../typings'

async function findByOwner(ownerId: string): Promise<Shop[]> {
  const resp = await api.call('find-shops', { ownerId })
  return resp && resp.data ? resp.data : []
}

async function create(shop: Shop): Promise<boolean> {
  const resp = await api.call('create-shop', { shop })
  return resp?.status === 200
}

async function update(shop: Shop): Promise<boolean> {
  const resp = await api.call('update-shop', { shop })
  return resp?.status === 200
}

async function remove(shop: Shop): Promise<boolean> {
  const resp = await api.call('delete-shop', { shop })
  return resp?.status === 200
}

export default {
  findByOwner,
  create,
  update,
  remove,
}
