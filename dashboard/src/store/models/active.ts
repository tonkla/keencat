import { Action, action } from 'easy-peasy'

import { Shop } from '../../typings'

export interface ActiveStateModel {
  shop: Shop | null
  setShop: Action<ActiveStateModel, Shop>
}

const activeState: ActiveStateModel = {
  shop: null,
  setShop: action((state, shop) => {
    state.shop = shop
  }),
}

export default activeState
