import { Action, action } from 'easy-peasy'

import { Order } from '../../typings'

export interface OrderStateModel {
  orders: Order[]
  setOrders: Action<OrderStateModel, Order[]>
}

const orderState: OrderStateModel = {
  orders: [],
  setOrders: action((state, orders) => {
    state.orders = orders
  }),
}

export default orderState
