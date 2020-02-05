import { Action, action } from 'easy-peasy'

export interface ActiveStateModel {
  categoryId: string | null
  shopId: string | null
  setCategoryId: Action<ActiveStateModel, string>
  setShopId: Action<ActiveStateModel, string>
}

const activeState: ActiveStateModel = {
  categoryId: null,
  shopId: null,
  setCategoryId: action((state, categoryId) => {
    state.categoryId = categoryId
  }),
  setShopId: action((state, shopId) => {
    state.shopId = shopId
  }),
}

export default activeState
