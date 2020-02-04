import api from '../api'
import { Page, User } from '../../typings'

async function find(pageId: string) {}

async function findByOwner(owner: User) {}

async function create(page: Page): Promise<void> {
  await api.call('/create-page', { page })
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
