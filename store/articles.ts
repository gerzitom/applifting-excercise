import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import Article from '~/types/Article'
import ArticleDetail from '~/types/ArticleDetail'
import { store } from '@/store'

@Module({
  name: 'articles',
  dynamic: true,
  store: store,
})
export default class Articles extends VuexModule {
  public articles: Array<Article> = []
  public articleDetails: Array<ArticleDetail> = []

  @Mutation
  setArticles(users: Article[]) {
    this.articles = users
  }

  @Mutation
  addArticleDetail(articleDetail: ArticleDetail) {
    const articleExists = this.articleDetails.find(
      (storedArticleDetail) =>
        storedArticleDetail.articleId === articleDetail.articleId
    )
    if (!articleExists) {
      this.articleDetails.push(articleDetail)
    }
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

  @Action({
    rawError: true,
  })
  public getArticleDetail(articleId: number): Promise<ArticleDetail> {
    return new Promise<ArticleDetail>((resolve, reject) => {
      $axios
        .get<ArticleDetail>(`/articles/${articleId}`)
        .then((response) => {
          this.context.commit('addArticleDetail', response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  @Action({
    rawError: true,
  })
  public getImage(imageId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      $axios
        .get(`/images/${imageId}`, { responseType: 'arraybuffer' })
        .then((response) => {
          let blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          resolve(URL.createObjectURL(blob))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
