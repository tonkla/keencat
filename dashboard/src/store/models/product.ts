import { Action, action, Thunk, thunk } from 'easy-peasy'

import remoteStorage from '../../services/remoteStorage'
import Product from '../../typings/product'

export interface ProductStateModel {
  products: Product[]
  create: Thunk<ProductStateModel, Product>
  setProducts: Action<ProductStateModel, Product[]>
  _create: Action<ProductStateModel, Product>
}

const productState: ProductStateModel = {
  products: [],
  create: thunk(async (actions, product) => {
    actions._create(product)
    await remoteStorage.createProduct(product)
  }),
  setProducts: action((state, products) => {
    state.products = products
  }),
  _create: action((state, product) => {
    state.products = [product, ...state.products]
  }),
}

export default productState
