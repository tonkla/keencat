import { persist } from 'easy-peasy'

export interface Injections {}

export interface StoreModel {}

const storeModel: StoreModel = persist({
  storage: 'localStorage',
  whitelist: [],
})

export default storeModel
