import cartState, { CartStateModel } from './cart'
import sessionState, { SessionStateModel } from './session'

export interface StoreModel {
  cartState: CartStateModel
  sessionState: SessionStateModel
}

const storeModel: StoreModel = { cartState, sessionState }

export default storeModel
