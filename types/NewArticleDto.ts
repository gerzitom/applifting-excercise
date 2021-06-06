export default class NewArticleDto {
  title: string
  perex: string
  imageId: string
  content: string

  constructor(title: string, perex: string, imageId: string, content: string) {
    this.title = title
    this.perex = perex
    this.imageId = imageId
    this.content = content
  }
}
