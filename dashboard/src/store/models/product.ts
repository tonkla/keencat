import { Action, action, Thunk, thunk } from 'easy-peasy'

import productRepository from '../../services/repositories/product'
import storage from '../../services/firebase/storage'
import { Injections, StoreModel } from './index'
import { Category, Product } from '../../typings'

export interface ProductStateModel {
  products: Product[]
  setProducts: Action<ProductStateModel, Product[]>
  create: Thunk<ProductStateModel, Product, Injections, StoreModel>
  update: Thunk<ProductStateModel, Product>
  remove: Thunk<ProductStateModel, Product, Injections, StoreModel>
  removeByCategory: Thunk<ProductStateModel, Category>
  _create: Action<ProductStateModel, Product>
  _update: Action<ProductStateModel, Product>
  _remove: Action<ProductStateModel, Product>
  _removeAll: Action<ProductStateModel>
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
      // Note: let categoryState updates products
      // actions._create(product)
    }
  }),
  update: thunk(async (actions, product) => {
    if (await productRepository.update(product)) actions._update(product)
  }),
  remove: thunk(async (actions, product, { getStoreActions, getStoreState }) => {
    if (await productRepository.remove(product)) {
      if (product.images && product.images.length > 0) {
        product.images.forEach(async imgUrl => await storage.deleteImage(imgUrl))
      }

      const { categories } = getStoreState().categoryState
      const category = categories.find(c => c.id === product.categoryId)
      if (category) {
        getStoreActions().categoryState.update({
          ...category,
          productIds: category.productIds.filter(id => id !== product.id),
        })
      }
      // Note: let categoryState updates products
      // actions._remove(product)
    }
  }),
  removeByCategory: thunk(async (actions, category) => {
    // Delete images in Firebase storage
    const products = await productRepository.findByIds(category.productIds)
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        product.images.forEach(async imgUrl => await storage.deleteImage(imgUrl))
      }
    }

    if (await productRepository.removeByCategory(category)) actions._removeAll()
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
  _removeAll: action(state => {
    state.products = []
  }),
}

export default productState
