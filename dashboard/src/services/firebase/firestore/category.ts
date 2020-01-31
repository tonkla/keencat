import { Category, Shop } from '../../../typings'

async function find(id: string) {}

async function findByShop(shop: Shop) {}

async function create(category: Category) {}

async function update(category: Category) {}

async function remove(category: Category) {}

export default {
  find,
  findByShop,
  create,
  update,
  remove,
}
