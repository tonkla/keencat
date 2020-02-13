import { persist } from 'easy-peasy'

import activeState, { ActiveStateModel } from './active'
import categoryState, { CategoryStateModel } from './category'
import productState, { ProductStateModel } from './product'
import sharedState, { SharedStateModel } from './shared'
import shopState, { ShopStateModel } from './shop'
import userState, { UserStateModel } from './user'

export interface Injections {}

export interface StoreModel {
  activeState: ActiveStateModel
  categoryState: CategoryStateModel
  productState: ProductStateModel
  sharedState: SharedStateModel
  shopState: ShopStateModel
  userState: UserStateModel
}

const storeModel: StoreModel = persist(
  { activeState, categoryState, productState, sharedState, shopState, userState },
  {
    storage: 'localStorage',
    // blacklist: ['categoryState', 'productState', 'sharedState', 'shopState'],
    whitelist: ['activeState', 'userState'],
  }
)

export default storeModel
