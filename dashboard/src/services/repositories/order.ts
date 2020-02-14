import api from '../api'
import { Order } from '../../typings'

async function findByShop(shopId: string): Promise<Order[]> {
  const resp = await api.call('/find-orders', { shopId })
  return resp && resp.data ? resp.data : []
}

export default {
  findByShop,
}
