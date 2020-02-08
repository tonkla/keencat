import { Action, action, Thunk, thunk } from 'easy-peasy'

import productRepository from '../../services/repositories/product'
import { Injections, StoreModel } from './index'
import { Product } from '../../typings'

export interface ProductStateModel {
  products: Product[]
  setProducts: Action<ProductStateModel, Product[]>
  create: Thunk<ProductStateModel, Product, Injections, StoreModel>
  update: Thunk<ProductStateModel, Product>
  remove: Thunk<ProductStateModel, Product, Injections, StoreModel>
  _create: Action<ProductStateModel, Product>
  _update: Action<ProductStateModel, Product>
  _remove: Action<ProductStateModel, Product>
}

const productState: ProductStateModel = {
  products: [],
  setProducts: action((state, products) => {
    state.products = products
  }),
  create: thunk(async (actions, product, { getStoreActions, getStoreState }) => {
    if (await productRepository.create(product)) {
      const categories = getStoreState().categoryState.categories
      const category = categories.find(c => c.id === product.categoryId)
      if (category) {
        getStoreActions().categoryState.update({
          ...category,
          productIds: [product.id, ...category.productIds],
        })
      }
      actions._create(product)
    }
  }),
  update: thunk(async (actions, product) => {
    await productRepository.update(product)
    actions._update(product)
  }),
  remove: thunk(async (actions, product, { getStoreActions, getStoreState }) => {
    if (await productRepository.remove(product)) {
      const categories = getStoreState().categoryState.categories
      const category = categories.find(c => c.id === product.categoryId)
      if (category) {
        getStoreActions().categoryState.update({
          ...category,
          productIds: category.productIds.filter(id => id !== product.id),
        })
      }
      actions._remove(product)
    }
  }),
  _create: action((state, product) => {
    state.products = [product, ...state.products]
  }),
  _update: action((state, product) => {
    state.products = [product, ...state.products.filter(p => p.id !== product.id)]
  }),
  _remove: action((state, product) => {
    state.products = state.products.filter(p => p.id !== product.id)
  }),
}

export default productState
