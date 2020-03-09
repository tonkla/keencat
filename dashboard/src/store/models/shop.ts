import { Action, action, Thunk, thunk } from 'easy-peasy'

import pageRepository from '../../services/repositories/page'
import shopRepository from '../../services/repositories/shop'
import { Injections, StoreModel } from './index'
import { Shop } from '../../typings'

export interface ShopStateModel {
  shops: Shop[]
  setShops: Action<ShopStateModel, Shop[]>
  create: Thunk<ShopStateModel, Shop>
  update: Thunk<ShopStateModel, Shop>
  remove: Thunk<ShopStateModel, Shop, Injections, StoreModel>
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
    if (await shopRepository.create(shop)) actions._create(shop)
  }),
  update: thunk(async (actions, shop) => {
    if (await shopRepository.update(shop)) actions._update(shop)
  }),
  remove: thunk(async (actions, shop, { getStoreActions, getStoreState, getState }) => {
    if (await shopRepository.remove(shop)) {
      // Remove page
      await pageRepository.remove(shop.pageId)

      const { productState: productActions, categoryState: categoryActions } = getStoreActions()
      // Delete all child products
      getStoreState().categoryState.categories.forEach(category =>
        productActions.removeByCategory(category)
      )

      // Delete all child categories
      categoryActions.removeByShop(shop)

      // Remove shop before reset active shop
      actions._remove(shop)

      // Finally, reset active shop
      const { shops } = getState()
      if (shops.length > 0) getStoreActions().activeState.setShopId(shops[0].id)
      else getStoreActions().activeState.setShopId(null)
    }
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
