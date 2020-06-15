import { createStore, createTypedHooks } from 'easy-peasy'

import storeModel, { StoreModel } from './models'
import { STORE_NAME } from '../constants'

const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>()
export { useStoreActions, useStoreDispatch, useStoreState }

export default createStore(storeModel, { name: STORE_NAME })
