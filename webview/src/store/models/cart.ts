import { Action, action } from 'easy-peasy'

import { CartItem } from '../../typings'

export interface CartStateModel {
  items: CartItem[]
  update: Action<CartStateModel, CartItem>
}

const cartState: CartStateModel = {
  items: [],
  update: action((state, item) => {
    state.items = [...state.items, item]
  }),
}

export default cartState
