import { Action, action } from 'easy-peasy'

export interface SessionStateModel {
  pageId: string | null
  customerId: string | null
  setPageId: Action<SessionStateModel, string>
  setCustomerId: Action<SessionStateModel, string>
}

const sessionState: SessionStateModel = {
  pageId: null,
  customerId: null,
  setPageId: action((state, pageId) => {
    state.pageId = pageId
  }),
  setCustomerId: action((state, customerId) => {
    state.customerId = customerId
  }),
}

export default sessionState
