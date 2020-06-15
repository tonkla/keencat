import { createStore, createTypedHooks } from 'easy-peasy'

import storeModel, { StoreModel } from './models'

const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>()
export { useStoreActions, useStoreDispatch, useStoreState }

export default createStore(storeModel)
