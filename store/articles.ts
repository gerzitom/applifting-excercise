import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
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
        .catch((err) => {
          const errorMessage =
            voteDetails.value === VoteValue.DOWM ? 'downvote' : 'upvote'
          reject(
            new Error(`Could not ${errorMessage} comment, please try it later`)
          )
        })
    })
  }

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

class CommentDetails {
  commentId: string
  articleId: string

  constructor(commentId: string, articleId: string) {
    this.commentId = commentId
    this.articleId = articleId
  }
}
