import { Action, action, Thunk, thunk } from 'easy-peasy'

import remoteStorage from '../../services/remoteStorage'
import Shop from '../../typings/shop'

export interface ShopStateModel {
  shops: Shop[]
  create: Thunk<ShopStateModel, Shop>
  setShops: Action<ShopStateModel, Shop[]>
  _create: Action<ShopStateModel, Shop>
}

const shopState: ShopStateModel = {
  shops: [],
  create: thunk(async (actions, shop) => {
    actions._create(shop)
    await remoteStorage.createShop(shop)
  }),
  setShops: action((state, shops) => {
    state.shops = shops
  }),
  _create: action((state, shop) => {
    state.shops = [shop, ...state.shops]
  }),
}

export default shopState
