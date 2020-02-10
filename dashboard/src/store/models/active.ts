import { Action, action } from 'easy-peasy'

export interface ActiveStateModel {
  shopId: string | null
  setShopId: Action<ActiveStateModel, string | null>
}

const activeState: ActiveStateModel = {
  shopId: null,
  setShopId: action((state, shopId) => {
    state.shopId = shopId
  }),
}

export default activeState
