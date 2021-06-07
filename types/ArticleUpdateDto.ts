export default class ArticleUpdateDto {
  articleId: string
  title: string
  perex: string
  imageId: string
  content: string

  constructor(
    articleId: string,
    title: string,
    perex: string,
    imageId: string,
    content: string
  ) {
    this.articleId = articleId
    this.title = title
    this.perex = perex
    this.imageId = imageId
    this.content = content
  }
}
