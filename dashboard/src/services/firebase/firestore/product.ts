import { Category, Product } from '../../../typings'

async function find(id: string) {}

async function findByCategory(category: Category) {}

async function create(product: Product) {}

async function update(product: Product) {}

async function remove(product: Product) {}

export default {
  find,
  findByCategory,
  create,
  update,
  remove,
}
