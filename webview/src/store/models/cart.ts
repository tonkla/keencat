import { Action, action } from 'easy-peasy'

import { CartItem } from '../../typings'

export interface CartStateModel {
  items: CartItem[]
  add: Action<CartStateModel, CartItem>
  update: Action<CartStateModel, CartItem[]>
}

const cartState: CartStateModel = {
  items: [],
  add: action((state, item) => {
    const rest = state.items.filter(i => i.product.id !== item.product.id)
    const old = state.items.find(i => i.product.id === item.product.id)
    if (old) {
      if (old.quantity + item.quantity <= item.product.quantity) {
        state.items = [
          ...rest,
          { ...old, quantity: old.quantity + item.quantity, amount: old.amount + item.amount },
        ]
      }
    } else {
      state.items = [...rest, item]
    }
  }),
  update: action((state, items) => {
    state.items = items
  }),
}

export default cartState
