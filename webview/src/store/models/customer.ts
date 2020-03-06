import { Action, action } from 'easy-peasy'

import { Customer } from '../../typings'

export interface CustomerStateModel {
  customer: Customer | null
  set: Action<CustomerStateModel, Customer>
}

const customerState: CustomerStateModel = {
  customer: null,
  set: action((state, customer) => {
    state.customer = customer
  }),
}

export default customerState
