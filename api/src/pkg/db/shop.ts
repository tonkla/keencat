import { Shop, User } from '../../typings'

async function find(id: string) {}

async function findByOwner(owner: User): Promise<Shop[]> {
  return []
}

async function create(shop: Shop): Promise<void> {}

async function update(shop: Shop) {}

async function remove(shop: Shop) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
