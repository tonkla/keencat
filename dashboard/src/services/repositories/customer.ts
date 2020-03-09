import api from '../api'
import { Customer } from '../../typings'

async function find(id: string): Promise<Customer | null> {
  const resp = await api.call('find-customer', { id })
  return resp && resp.data ? resp.data : null
}

export default {
  find,
}
