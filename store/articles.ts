import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import Article from '~/types/Article'
import ArticleDetail from '~/types/ArticleDetail'
import { store } from '@/store'
import NewCommentDto from '~/types/NewCommentDto'
import Comment from '~/types/Comment'
import NewArticleDto from '~/types/NewArticleDto'
import ArticlesLoadDto from '~/types/ArticlesLoadDto'

@Module({
  name: 'articles',
  dynamic: true,
  store: store,
})
export default class Articles extends VuexModule {
  public articles: Array<Article> = []
  public articleDetails: Array<ArticleDetail> = []

  /**
   * Checks if article is already in store.
   * Add to store if is not in store.
   * @param newArticle to be added to store.
   */
  @Mutation
  addArticle(newArticle: Article) {
    const similarArticle = this.articles.find(
      (article) => article.articleId === newArticle.articleId
    )
    if (!similarArticle) {
      this.articles.push(newArticle)
    }
  }

  /**
   * Updates article
   * @param updatedArticle to be added to store.
   */
  @Mutation
  updateArticleMutation(updatedArticle: Article) {
    const articleIndex = this.articles.findIndex(
      (article) => article.articleId === updatedArticle.articleId
    )
    console.log(articleIndex)
    // if (articleIndex === -1) throw new Error('Article was not found in store')
    this.articles[articleIndex] = updatedArticle
  }

  /**
   * Updates article detail
   * @param updatedArticle to be added to store.
   */
  @Mutation
  updateArticleDetailMutation(updatedArticle: ArticleDetail) {
    const articleIndex = this.articleDetails.findIndex(
      (article) => article.articleId === updatedArticle.articleId
    )
    console.log(articleIndex)
    // if (articleIndex === -1) throw new Error('Article was not found in store')
    this.articleDetails[articleIndex] = updatedArticle
  }

  /**
   * Checks if article detail is in store
   * Add to store if is not in store.
   * @param articleDetail
   */
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

  /**
   * Fetch articles from backend.
   * @param options:ArticlesLoadDto
   */
  @Action({
    rawError: true,
  })
  async getArticles(options?: ArticlesLoadDto): Promise<Article[]> {
    let url = '/articles'
    if (options) {
      url += `?offset=${options.offset}&limit=${options.limit}`
    }
    interface Response {
      pagination: {
        offset: number
        limit: number
        total: number
      }
      items: Article[]
    }
    const response = await $axios.get<Response>(url)
    const articles = response.data.items
    articles.forEach((article) => {
      this.context.commit('addArticle', article)
    })
    return articles
  }

  /**
   * Store all article details of user.
   * @return Promise with array of ArticlesDetails
   */
  @Action({
    rawError: true,
  })
  async getArticleDetails(): Promise<ArticleDetail[]> {
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
    for (const article of articles) {
      await this.context.commit('addArticle', article)
    }
    return await Promise.all(
      articles.map(async (article) => {
        return await this.context.dispatch(
          'getArticleDetail',
          article.articleId
        )
      })
    )
  }

  /**
   * Save article to backend.
   * If success, store new article in articles and articleDetails
   * @param newArticleDto data of new article
   */
  @Action({
    rawError: true,
  })
  async saveArticle(newArticleDto: NewArticleDto): Promise<Article> {
    const response = await $axios.post<ArticleDetail>(
      '/articles',
      newArticleDto
    )
    const newArticleDetail = response.data as ArticleDetail
    const newArticle = response.data as Article
    this.context.commit('addArticle', newArticle)
    this.context.commit('addArticleDetail', newArticleDetail)
    return newArticle
  }

  /**
   * Save article to backend.
   * If success, store new article in articles and articleDetails
   * @param articleDto data of new article
   */
  @Action({
    rawError: true,
  })
  async updateArticle(articleDto: ArticleDetail): Promise<void> {
    const response = await $axios.patch<ArticleDetail>(
      `/articles/${articleDto.articleId}`,
      articleDto
    )
    const newArticleDetail = response.data as ArticleDetail
    const newArticle = response.data as Article
    this.context.commit('updateArticleMutation', newArticle)
    this.context.commit('updateArticleDetailMutation', newArticleDetail)
  }

  /**
   * Gets article detail
   * @param articleId id of article
   */
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

  /**
   * Gets article detail
   * @param articleId id of article
   */
  @Action({
    rawError: true,
  })
  public removeArticle(articleId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios
        .delete<void>(`/articles/${articleId}`)
        .then(() => {
          this.context.commit('removeArticleMutation', articleId)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Updates article
   * @param articleId Id of article to be removed
   */
  @Mutation
  removeArticleMutation(articleId: string) {
    this.articles = this.articles.filter(
      (article) => article.articleId !== articleId
    )
    this.articleDetails = this.articleDetails.filter(
      (article) => article.articleId !== articleId
    )
  }

  /**
   * Remove all articles from store
   */
  @Mutation
  public REMOVE_ALL_ARTICLES() {
    this.articles = []
    this.articleDetails = []
  }

  /**
   * Gets image by id
   * @param imageId
   * @return url to be used in <img/> tag
   */
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

  /**
   * Add comment to backend.
   * Send post request to API.
   * When done, add new comment id to data and save new comment to store
   * @param dto data of new comment
   */
  @Action({
    rawError: true,
  })
  public addComment(dto: NewCommentDto): Promise<Comment> {
    return new Promise<Comment>((resolve, reject) => {
      $axios
        .post<Comment>('/comments', dto)
        .then((response) => {
          const newComment = response.data as Comment
          newComment.articleId = dto.articleId
          // newComment.postedAt = response.data.
          this.context.commit('addCommentMutation', newComment)
          resolve(newComment)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Mutation, that adds new comment to store
   * @param newComment data of new comment
   * @private
   */
  @Mutation
  private addCommentMutation(newComment: Comment) {
    this.articleDetails.forEach((article) => {
      if (article.articleId === newComment.articleId) {
        article.comments.push(newComment)
      }
    })
  }

  /**
   * Votes for comment.
   * API does not indicate, that user already voted, just send OK message.
   * On API request is done dispatch mutation, that checks if vote by current user has been made, throw error if does.
   * @param voteDetails specifies articleId, commentId and if comment should be upvoted or downvoted
   * @return new score
   */
  @Action({
    rawError: true,
  })
  public voteComment(voteDetails: VoteDetails): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const direction = voteDetails.value === VoteValue.UP ? 'up' : 'down'
      $axios
        .post<Comment>(`/comments/${voteDetails.commentId}/vote/${direction}`)
        .then((response) => {
          voteDetails.actualScore = response.data.score
          try {
            this.context.commit('voteCommentMutation', voteDetails)
          } catch (e) {
            reject(e)
          }
          resolve(response.data.score)
        })
        .catch(() => {
          const errorMessage =
            voteDetails.value === VoteValue.DOWM ? 'downvote' : 'upvote'
          reject(
            new Error(`Could not ${errorMessage} comment, please try it later`)
          )
        })
    })
  }

  /**
   * Adds new score to comment.
   * Checks if user has made mutation,
   * if user did made mutation, throws new Error
   * @param details
   * @private
   */
  @Mutation
  private voteCommentMutation(details: VoteDetails) {
    this.articleDetails.forEach((article) => {
      if (article.articleId === details.articleId) {
        article.comments.forEach((comment) => {
          if (comment.commentId === details.commentId) {
            if (comment.score === details.actualScore) {
              throw new Error('You already voted.')
            }
            comment.score = details.actualScore
          }
        })
      }
    })
  }
}

export enum VoteValue {
  UP = 1,
  DOWM = -1,
}

export class VoteDetails {
  commentId: string
  articleId: string
  value: VoteValue
  actualScore: number = 0

  constructor(commentId: string, articleId: string, value: number) {
    this.commentId = commentId
    this.articleId = articleId
    this.value = value
  }
}
