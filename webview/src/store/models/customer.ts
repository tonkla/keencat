import { Action, action, Thunk, thunk } from 'easy-peasy'

import api from '../../services/api'
import { Customer, Session } from '../../typings'

interface CustomerWithSession {
  customer: Customer
  session: Session
}

export interface CustomerStateModel {
  customer: Customer | null
  set: Thunk<CustomerStateModel, CustomerWithSession>
  _set: Action<CustomerStateModel, Customer>
}

const customerState: CustomerStateModel = {
  customer: null,
  set: thunk(async (actions, payload) => {
    if (await api.updateCustomer(payload.session, payload.customer)) {
      actions._set(payload.customer)
    }
  }),
  _set: action((state, customer) => {
    state.customer = customer
  }),
}

export default customerState
