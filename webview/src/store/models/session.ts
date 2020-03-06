import { Action, action } from 'easy-peasy'

import { Session } from '../../typings'

export interface SessionStateModel {
  session: Session | null
  set: Action<SessionStateModel, Session>
}

const sessionState: SessionStateModel = {
  session: null,
  set: action((state, session) => {
    state.session = session
  }),
}

export default sessionState
