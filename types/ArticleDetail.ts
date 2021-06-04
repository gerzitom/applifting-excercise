import Comment from '~/types/Comment'

export default class ArticleDetail {
  articleId: string
  title: string
  perex: string
  imageId: string
  createdAt: string
  lastUpdatedAt: string
  content: string
  comments: Comment[]

  constructor(
    articleId: string,
    title: string,
    perex: string,
    imageId: string,
    createdAt: string,
    lastUpdatedAt: string,
    content: string,
    comments: Comment[]
  ) {
    this.articleId = articleId
    this.title = title
    this.perex = perex
    this.imageId = imageId
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt
    this.content = content
    this.comments = comments
  }
}
