import { Action, action, Thunk, thunk } from 'easy-peasy'

import remoteStorage from '../../services/remoteStorage'
import Category from '../../typings/category'

export interface CategoryStateModel {
  categories: Category[]
  create: Thunk<CategoryStateModel, Category>
  setCategories: Action<CategoryStateModel, Category[]>
  _create: Action<CategoryStateModel, Category>
}

const categoryState: CategoryStateModel = {
  categories: [],
  create: thunk(async (actions, category) => {
    actions._create(category)
    await remoteStorage.createCategory(category)
  }),
  setCategories: action((state, categories) => {
    state.categories = categories
  }),
  _create: action((state, category) => {
    state.categories = [category, ...state.categories]
  }),
}

export default categoryState
