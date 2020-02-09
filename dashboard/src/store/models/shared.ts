import { Action, action } from 'easy-peasy'

export interface SharedStateModel {
  isCreateShop: boolean
  setCreateShop: Action<SharedStateModel, boolean>
}

const sharedState: SharedStateModel = {
  isCreateShop: false,
  setCreateShop: action((state, create) => {
    state.isCreateShop = create
  }),
}

export default sharedState
