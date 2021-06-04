import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import Article from '~/types/Article'
import ArticleDetail from '~/types/ArticleDetail'
import { store } from '@/store'
import NewCommentDto from '~/types/NewCommentDto'
import Comment from '~/types/Comment'

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

  @Mutation
  private addCommentMutation(newComment: Comment) {
    this.articleDetails.forEach((article) => {
      if (article.articleId === newComment.articleId) {
        article.comments.push(newComment)
      }
    })
  }

  @Action({
    rawError: true,
  })
  public voteComment(voteDetails: VoteDetails): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const direction = voteDetails.value === VoteValue.UP ? 'up' : 'down'
      $axios
        .post<Comment>(`/comments/${voteDetails.commentId}/vote/${direction}`)
        .then((response) => {
          this.context.commit('voteCommentMutation', voteDetails)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  @Mutation
  private voteCommentMutation(details: VoteDetails) {
    this.articleDetails.forEach((article) => {
      if (article.articleId === details.articleId) {
        article.comments.forEach((comment) => {
          if (comment.commentId === details.commentId) {
            comment.score += details.value.valueOf()
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

  constructor(commentId: string, articleId: string, value: number) {
    this.commentId = commentId
    this.articleId = articleId
    this.value = value
  }
}
