import { Action, action, Thunk, thunk } from 'easy-peasy'

import auth from '../../services/firebase/auth'
import { User } from '../../typings'

export interface UserStateModel {
  user: User | null
  set: Action<UserStateModel, User | null>
  signOut: Thunk<UserStateModel>
}

const userState: UserStateModel = {
  user: null,
  set: action((state, user) => {
    state.user = user
  }),
  signOut: thunk(async () => {
    await auth.signOut()
    localStorage.clear()
    window.location.href = '/login'
  }),
}

export default userState
