import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import Article from '~/types/Article'

@Module({
  name: 'articles',
  stateFactory: true,
  namespaced: true,
})
export default class Articles extends VuexModule {
  public articles: Article[] = []

  @Mutation
  setArticles(users: Article[]) {
    this.articles = users
  }

  @Action({
    rawError: true,
  })
  async getArticles(): Promise<Article[]> {
    interface Response {
      pagination: {
        offset: number
        limit: number
        total: number
      }
      items: Article[]
    }
    const response = await $axios.get<Response>('/articles')
    const articles = response.data.items
    this.context.commit('setArticles', articles)
    return articles
  }
}
