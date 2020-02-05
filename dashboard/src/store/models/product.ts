import { Action, action, Thunk, thunk } from 'easy-peasy'

import productRepository from '../../services/repositories/product'
import { Product } from '../../typings'

export interface ProductStateModel {
  products: Product[]
  create: Thunk<ProductStateModel, Product>
  setProducts: Action<ProductStateModel, Product[]>
  _create: Action<ProductStateModel, Product>
}

const productState: ProductStateModel = {
  products: [],
  create: thunk(async (actions, product) => {
    await productRepository.create(product)
    actions._create(product)
  }),
  setProducts: action((state, products) => {
    state.products = products
  }),
  _create: action((state, product) => {
    state.products = [product, ...state.products]
  }),
}

export default productState
