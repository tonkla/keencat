import { Action, action, Thunk, thunk } from 'easy-peasy'

import shopRepository from '../../services/repositories/shop'
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
    await shopRepository.create(shop)
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
