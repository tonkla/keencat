import api from '../api'
import { Page } from '../../typings'

async function find(pageId: string) {}

async function findByOwner(ownerId: string) {}

async function create(page: Page): Promise<boolean> {
  const resp = await api.call('/create-page', { page })
  return resp?.status === 200
}

async function update(page: Page) {}

async function remove(page: Page) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
