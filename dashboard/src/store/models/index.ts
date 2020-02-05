import { persist } from 'easy-peasy'

import activeState, { ActiveStateModel } from './active'
import categoryState, { CategoryStateModel } from './category'
import productState, { ProductStateModel } from './product'
import shopState, { ShopStateModel } from './shop'
import userState, { UserStateModel } from './user'

export interface StoreModel {
  activeState: ActiveStateModel
  categoryState: CategoryStateModel
  productState: ProductStateModel
  shopState: ShopStateModel
  userState: UserStateModel
}

const storeModel: StoreModel = persist(
  { activeState, categoryState, productState, shopState, userState },
  {
    storage: 'localStorage',
    blacklist: ['categoryState', 'productState'],
  }
)

export default storeModel
