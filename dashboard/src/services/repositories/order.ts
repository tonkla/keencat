import api from '../api'
import { Order } from '../../typings'

async function find(id: string): Promise<Order | null> {
  const resp = await api.call('/find-order', { id })
  return resp && resp.data ? resp.data : null
}

async function findByShop(shopId: string, createdDate: string): Promise<Order[]> {
  const resp = await api.call('/find-orders', { shopId, createdDate })
  return resp && resp.data ? resp.data : []
}

export default {
  find,
  findByShop,
}
