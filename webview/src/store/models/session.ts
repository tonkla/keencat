import { Action, action } from 'easy-peasy'

export interface SessionStateModel {
  hmac: string | null
  pageId: string | null
  customerId: string | null
  setHmac: Action<SessionStateModel, string>
  setPageId: Action<SessionStateModel, string>
  setCustomerId: Action<SessionStateModel, string>
}

const sessionState: SessionStateModel = {
  hmac: null,
  pageId: null,
  customerId: null,
  setHmac: action((state, hmac) => {
    state.hmac = hmac
  }),
  setPageId: action((state, pageId) => {
    state.pageId = pageId
  }),
  setCustomerId: action((state, customerId) => {
    state.customerId = customerId
  }),
}

export default sessionState
