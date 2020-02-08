import api from '../api'
import { Page } from '../../typings'

async function create(page: Page): Promise<boolean> {
  const resp = await api.call('/create-page', { page })
  return resp?.status === 200
}

export default {
  create,
}
