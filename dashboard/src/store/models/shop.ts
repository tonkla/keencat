import { Action, action, Thunk, thunk } from 'easy-peasy'

import shopRepository from '../../services/repositories/shop'
import { Shop } from '../../typings'

export interface ShopStateModel {
  shops: Shop[]
  setShops: Action<ShopStateModel, Shop[]>
  create: Thunk<ShopStateModel, Shop>
  update: Thunk<ShopStateModel, Shop>
  remove: Thunk<ShopStateModel, Shop>
  _create: Action<ShopStateModel, Shop>
  _update: Action<ShopStateModel, Shop>
  _remove: Action<ShopStateModel, Shop>
}

const shopState: ShopStateModel = {
  shops: [],
  setShops: action((state, shops) => {
    state.shops = shops
  }),
  create: thunk(async (actions, shop) => {
    await shopRepository.create(shop)
    actions._create(shop)
  }),
  update: thunk(async (actions, shop) => {
    await shopRepository.update(shop)
    actions._update(shop)
  }),
  remove: thunk(async (actions, shop) => {
    await shopRepository.remove(shop)
    actions._remove(shop)
  }),
  _create: action((state, shop) => {
    state.shops = [shop, ...state.shops]
  }),
  _update: action((state, shop) => {
    state.shops = [shop, ...state.shops.filter(s => s.id !== shop.id)]
  }),
  _remove: action((state, shop) => {
    state.shops = state.shops.filter(s => s.id !== shop.id)
  }),
}

export default shopState
