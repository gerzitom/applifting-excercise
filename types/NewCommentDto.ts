export default class NewCommentDto {
  articleId: string
  author: string
  content: string

  constructor(articleId: string, author: string, content: string) {
    this.articleId = articleId
    this.author = author
    this.content = content
  }
}
