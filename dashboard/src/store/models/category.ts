import { Action, action, Thunk, thunk } from 'easy-peasy'

import categoryRepository from '../../services/repositories/category'
import { Injections, StoreModel } from './index'
import { Category } from '../../typings'

export interface CategoryStateModel {
  categories: Category[]
  setCategories: Action<CategoryStateModel, Category[]>
  create: Thunk<CategoryStateModel, Category, Injections, StoreModel>
  update: Thunk<CategoryStateModel, Category>
  remove: Thunk<CategoryStateModel, Category, Injections, StoreModel>
  _create: Action<CategoryStateModel, Category>
  _update: Action<CategoryStateModel, Category>
  _remove: Action<CategoryStateModel, Category>
}

const categoryState: CategoryStateModel = {
  categories: [],
  setCategories: action((state, categories) => {
    state.categories = categories
  }),
  create: thunk(async (actions, category, { getStoreActions, getStoreState }) => {
    if (await categoryRepository.create(category)) {
      const shops = getStoreState().shopState.shops
      const shop = shops.find(s => s.id === category.shopId)
      if (shop) {
        getStoreActions().shopState.update({
          ...shop,
          categoryIds: [category.id, ...shop.categoryIds],
        })
      }
      actions._create(category)
    }
  }),
  update: thunk(async (actions, category) => {
    if (await categoryRepository.update(category)) actions._update(category)
  }),
  remove: thunk(async (actions, category, { getStoreActions, getStoreState }) => {
    if (await categoryRepository.remove(category)) {
      const shops = getStoreState().shopState.shops
      const shop = shops.find(s => s.id === category.shopId)
      if (shop) {
        getStoreActions().shopState.update({
          ...shop,
          categoryIds: shop.categoryIds.filter(id => id !== category.id),
        })
      }
      actions._remove(category)
    }
  }),
  _create: action((state, category) => {
    state.categories = [category, ...state.categories]
  }),
  _update: action((state, category) => {
    state.categories = [category, ...state.categories.filter(c => c.id !== category.id)]
  }),
  _remove: action((state, category) => {
    state.categories = state.categories.filter(c => c.id !== category.id)
  }),
}

export default categoryState
