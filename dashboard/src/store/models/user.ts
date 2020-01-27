import { Action, action } from 'easy-peasy'

import User from '../../typings/user'

export interface UserStateModel {
  user: User | null
  set: Action<UserStateModel, User>
}

const userState: UserStateModel = {
  user: null,
  set: action((state, user) => {
    state.user = user
  }),
}

export default userState
