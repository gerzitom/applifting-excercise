import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

// modules
import Articles from '~/store/articles'
import User from '~/store/user'

// create singletons
export let articles: Articles
export let userStore: User

export function initialiseStores(store: Store<any>): void {
  articles = getModule(Articles, store)
  userStore = getModule(User, store)
}
export const modules = {
  articles: Articles,
  userStore: User,
}

// export { initialiseStores, articles }
