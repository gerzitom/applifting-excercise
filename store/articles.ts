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
  async getArticles() {
    const apiKey = this.context.rootState.user.user.apiKey
    console.log(apiKey)

    interface Response {
      pagination: {
        offset: number
        limit: number
        total: number
      }
      items: Article[]
    }

    const config = {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
    const response = await $axios.get<Response>('/articles', config)
    console.log(response)
    const articles = response.data.items
    // const articles = [
    //   new Article('23', 'ASDA', 'ASDAS', 'ASDAS', 'ASDAS', 'ASDASd'),
    // ]
    this.context.commit('setArticles', articles)
    return articles
  }
}
