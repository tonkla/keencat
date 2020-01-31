import { Action, action, Thunk, thunk } from 'easy-peasy'

import { shopRepository as shopRepo } from '../../services/api'
import { Shop } from '../../typings'

export interface ShopStateModel {
  shops: Shop[]
  create: Thunk<ShopStateModel, Shop>
  setShops: Action<ShopStateModel, Shop[]>
  _create: Action<ShopStateModel, Shop>
}

const shopState: ShopStateModel = {
  shops: [],
  create: thunk(async (actions, shop) => {
    await shopRepo.create(shop)
    actions._create(shop)
  }),
  setShops: action((state, shops) => {
    state.shops = shops
  }),
  _create: action((state, shop) => {
    state.shops = [shop, ...state.shops]
  }),
}

export default shopState
