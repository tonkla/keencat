import cartState, { CartStateModel } from './cart'
import customerState, { CustomerStateModel } from './customer'
import sessionState, { SessionStateModel } from './session'

export interface StoreModel {
  cartState: CartStateModel
  customerState: CustomerStateModel
  sessionState: SessionStateModel
}

const storeModel: StoreModel = { cartState, customerState, sessionState }

export default storeModel
