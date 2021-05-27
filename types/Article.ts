export default class Article {
  articleId: string
  title: string
  perex: string
  imageId: string
  createdAt: string
  lastUpdatedAt: string

  constructor(
    articleId: string,
    title: string,
    perex: string,
    imageId: string,
    createdAt: string,
    lastUpdatedAt: string
  ) {
    this.articleId = articleId
    this.title = title
    this.perex = perex
    this.imageId = imageId
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt
  }
}
