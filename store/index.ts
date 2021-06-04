import { Store } from 'vuex'
// import { initialiseStores } from '~/utils/store-accessor'
//
// const initializer = (store: Store<any>) => initialiseStores(store)
//
// export const plugins = [initializer]
//
// export * from '~/utils/store-accessor'

import Vuex from 'vuex'

export const store = new Vuex.Store({
  /*
  Ideally if all your modules are dynamic
  then your store is registered initially
  as a completely empty object
  */
})
